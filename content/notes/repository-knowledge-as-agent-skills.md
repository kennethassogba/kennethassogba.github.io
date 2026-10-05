<!--
title: Agent skills for a large codebase
slug: notes/repository-knowledge-as-agent-skills
date: 2026-10-05
description: Documenting the codebase and engineering practices for coding agents.
categories: AI & agents
-->

I work on the compiler for FPGA prototyping at Siemens EDA, mainly on placement and partitioning. I've also started working on netlist qualification, including clock handling.

Alongside that work, I write agent skills and integrate MCP servers into our development workflow.

The skills document the codebase and our engineering practices. A coding agent needs that information to work on an existing project: where to make a change, which constraints matter, and how to test it.

## What goes into a skill

For a development task, a skill should answer:

- Where does this kind of change belong?
- Which constraints does the surrounding system rely on?
- What is a good example already in the repository?
- Which checks should run after the change?
- When is it time to ask a person instead of guessing?

Useful instructions name the relevant subsystem, point to an existing implementation, and give the command for the relevant checks.

## MCP integrations

A skill contains instructions. An MCP server exposes tools. I use skills to explain how to work in the repository, and MCP integrations to connect tools used during development.

The instructions should say when to use a tool and how to check its result.

## Review and testing

I use AI to assist development. The resulting changes still need code review, tests, and performance checks.

I'm also [making this website AI-native](/notes/a-website-for-people-and-agents), with Markdown pages and tools for agents to search and read the content.
