<!--
title: Building La Bulle
slug: notes/building-la-bulle
date: 2026-09-27
description: Scaffolding a voice coaching app with Codex, OpenAI Realtime, Cloudflare Workers, D1, and Resend.
categories: AI & agents
-->

[La Bulle](https://bulle.hodge-podge.workers.dev/?lang=en) is a voice coaching app I built with Séb and Fano for the X-IA hackathon. Séb brought the Kedo micro-coaching protocol: 14 questions, asked one at a time, with room to think.

You describe a situation, talk it through, then get an editable recap. You can keep a few notes for the next session, send the recap by email, or continue in Notion.

I worked with Codex on the development. Here’s how the project took shape over September 26 and 27.

## Scaffold

I started by writing down the user flow, the architecture, and the expected behavior during a call. Those documents became the basis for the implementation: how a session starts, what happens when someone asks for time, what gets saved, and which actions need a click from the person using the app.

The scaffold was small:

```text
public/          HTML, CSS, and browser JavaScript
worker/          TypeScript API and model calls
migrations/      D1 schema changes
tests/           API and browser-controller tests
docs/            Architecture, behavior, and test scenarios
wrangler.jsonc   Cloudflare configuration
```

The frontend uses plain HTML, CSS, and JavaScript. A Cloudflare Worker serves the static files and handles `/api/*`. D1 stores sessions, messages, approved notes, and the state of background jobs. The Worker calls the provider APIs with `fetch`.

Wrangler runs the Worker and D1 locally, applies the database migrations, and deploys the app. The build command runs a dry-run deployment; publishing is a separate manual step.

The first version already had text coaching, a voice call, and notes. From there, I worked through the call behavior, added French and English, and built the Notion flow. The editable recap and email came next. I kept the docs alongside the code as these decisions changed.

## Models

The app uses three OpenAI models:

| Model | What it does |
| --- | --- |
| `gpt-4.1-mini` | Text coaching, proposed notes, recaps, and the three Notion agents, through the Responses API |
| `gpt-realtime-2.1` | The voice conversation over WebRTC, with the `marin` voice |
| `gpt-4o-transcribe` | Transcription of the person’s speech during the call |

For text, the Worker sends the recent conversation and the notes the person has approved. Responses use a strict JSON schema. The text coach returns a reply and a conversation decision: clarify, rephrase, explore, or finish. The app uses that decision to handle the end of a session.

Voice has a separate path. The browser sends its WebRTC offer to the Worker, which creates the Realtime call with OpenAI and returns the answer. After that, audio travels directly between the browser and OpenAI. The API key stays in the Worker.

Transcription supplies the written record. It doesn’t control when the voice model answers, and a failed transcription doesn’t stop the call. The app saves the received transcript when the call ends; it doesn’t record audio files.

## Getting the call to behave properly

The first implementation mixed browser timers with Realtime turn-taking. It broke the conversation. I [removed the browser turn controller](https://github.com/kennethassogba/hodge-podge/commit/b6666f83099242b719d0a276ce70700c17412aa8) and let Realtime handle ordinary turns:

```json
{
  "type": "semantic_vad",
  "eagerness": "medium",
  "create_response": true,
  "interrupt_response": true
}
```

The browser requests the greeting. After that, Realtime detects the end of a turn and creates the next response. The person can interrupt the coach without waiting for a button.

An explicit request for a pause needs different behavior. If someone says “give me a moment”, the model can call `pause_coaching`. The app lets the acknowledgement finish, then starts a timer. It asks once whether the person is ready to continue. If they start speaking first, it cancels the timer. If they ask to resume on their own, it doesn’t schedule a reminder.

I also had to handle incomplete responses. The original 300-token output limit could cut off a spoken explanation. I raised it to 2,048 tokens and added one retry for a response truncated by the token limit or a temporary server error. Before retrying, the app removes the incomplete output from the conversation context and saved transcript. A normal interruption by the person doesn’t trigger that retry.

Hanging up closes the microphone immediately. Saving the transcript happens afterward, with retries for temporary failures. The app waits for a confirmed save before opening the recap. On mobile, it requests a screen wake lock during the call and releases it afterward. That prevents automatic screen sleep when the browser permits it; it doesn’t make the call work with the phone locked.

These were separate changes, each with a specific scenario to reproduce. “Improve the voice experience” would have been too vague to implement or verify.

## Recaps and email

The recap is generated from the selected conversation. It distinguishes decisions from ideas that came up, and can say that no action was decided. The person can edit it before copying it, sending it, or using it in Notion.

The recap and the coach’s memory are separate. Generating a recap doesn’t silently add it to the next session. A proposed note only becomes memory after the person chooses to keep it.

For email, the Worker calls Resend using a server-side key and a verified sending domain. It sends the edited recap, with a UTF-8 transcript attachment if requested. The email module is small: it builds the plain-text and escaped HTML bodies, adds the optional attachment, and calls the Resend API.

A fingerprint of the content supplies an idempotency key, so repeated requests for the same email reuse the key. D1 records the send status. The app doesn’t keep the recipient address or email body in that send record. A response from Resend confirms acceptance, rather than delivery to the inbox.

## Continuing in Notion

Notion is optional. Coaching, the recap, and email work without connecting it.

After OAuth, the person selects up to three pages and submits the edited recap as their intention. The full coaching transcript isn’t passed to this flow. Three sequential model calls then do the work:

1. Read the selected material and investigate the intention, citing exact excerpts.
2. Check the findings against those sources. Unsupported findings stop the job and request more context.
3. Prepare a proposal the person can edit, such as a meeting outline or a decision rule.

The Worker checks that cited excerpts exist in the retrieved text. The job’s stage and results live in D1. A scheduled Worker resumes pending jobs, and a database lease prevents two executions from advancing the same job at once.

Publishing is a separate request after the person has reviewed the proposal. It creates a new Notion page. The agents don’t edit the source pages.

## Testing as I went

The API tests use Miniflare with a real local D1 database and simulated provider responses. They cover ownership checks, approved memory, recap edits, email attachments, duplicate sends, and the Notion publication flow. Browser tests run the actual voice controller with simulated WebRTC events, including late events, interruption, pause cancellation, and hangup during a retry.

Those tests can check application behavior without spending API credits. They can’t tell me whether a spoken exchange sounds right. For that, I added separate scripts that exercise the real Realtime connection with synthetic audio, plus a browser harness that injects audio into the app’s WebRTC path.

The development loop was concrete: reproduce a problem, change the relevant behavior with Codex, run the local checks, then try the call again. The scaffold got the app running. Most of the following work was in the parts between model calls: turn-taking, cancellation, saving, retries, and making sure the person’s edits were used.

The [source code](https://github.com/kennethassogba/hodge-podge) includes the [architecture](https://github.com/kennethassogba/hodge-podge/blob/main/docs/architecture.md), [voice behavior](https://github.com/kennethassogba/hodge-podge/blob/main/docs/silence.md), and [recap and email implementation](https://github.com/kennethassogba/hodge-podge/blob/main/docs/apres-bulle.md).
