<!--
title: Agent skills for a large codebase
slug: notes/repository-knowledge-as-agent-skills
date: 2026-10-05
description: Documenting the codebase and engineering practices for coding agents.
categories: AI & agents
-->

I work on the compiler for FPGA prototyping at Siemens EDA, mainly on placement and partitioning. I've also started working on netlist qualification, including clock handling.

I also write agent skills that document our codebase and engineering practices, and connect development tools through MCP servers. The skills tell an agent where a change belongs, which constraints it needs to respect, and how to test the result.

## What goes into a skill

For a development task, a skill should answer:

- Where does this kind of change belong?
- Which constraints does the surrounding system rely on?
- What is a good example already in the repository?
- Which checks should run after the change?
- When is it time to ask a person instead of guessing?

I want the instructions to name the subsystem, point to an existing implementation, and include the command to run the checks.

## MCP integrations

I put instructions for working in the repository in skills. MCP servers give the agent access to development tools.

The instructions should say when to use a tool and how to check its result.

## Review and testing

I use AI to assist development. The resulting changes still need code review, tests, and performance checks.

I'm also [making this website AI-native](/notes/a-website-for-people-and-agents), with Markdown pages and tools for agents to search and read the content.
