---
title: 'Building a Homepage with AI'
slug: 20260312-building-a-homepage-with-ai
date: 2026-03-12
author: Lars Kleen
lang: en
tags: [ai, architecture, efficiency]
excerpt: 'How I generated the architecture and then orchestrated code generation to build this page.'
---

Over the past year AI has made great strides in generating source code. Around 2024 I started to use it on a regular basis.
During that time it has evolved from a tool that could hardly generate code that compiles to one that can now act as a
team of software developers and architects for me.

I have been working as a technical lead since 2018. What I'm doing with AI is basically the same as what I'm doing with my human engineering colleagues.
I evaluate frameworks against actual requirements and think carefully about how specific decisions
will influence the efficiency of the development process in the future. Normally I'm the person who then writes specifications
and architecture documentation. How well that translates to actual code depends heavily on the quality of my spec and the maturity of the team.
And it always involves many cycles of writing, reviewing and refactoring code to achieve a good result.

Leveraging AI I can do that on my own. Just faster. Of course, you need to know what is the right path to follow and how to guide it
in the right direction. But that is what I'm doing as tech lead all the time anyway. The turnaround times are just reduced a lot — AI
can now generate the amount of working code within hours which would previously keep a developer busy for weeks. The initial version of
this page has a UI framework and internationalization integrated, unit and UI testing, static code analysis and a deployment all set
up and running.

From the first idea to writing my first actual blog post it was less than 10 hours of work. I guess if I had done
the research and code writing the conventional way, it would have taken me something like 50–60 hours. And I suspect
even that is optimistic.

So what will happen next? For one, those 10 hours will shrink further. Currently, AI still struggles to understand the
structure of a project as a whole. Even when I repeatedly point to the initially created architecture document, it tends
to go off-script. Just like real human developers. It is obvious that it struggles with
complexity which involves many layers of abstraction. That is ultimately the time-consuming part — the code itself is generated
in no time. Often it works correctly within the scope it can currently see, but it still takes a lot of my
attention to keep it on track — repeating the same guidance over and over. And the more you use it, the more you
notice it isn't learning. It barely keeps the context of the current chat and in the end you have to tell it exactly the
same things over and over again. That is the difference from a mature engineering team or my 3-year-old daughter.
They retain and adapt. That said, if AI quality continues to improve at its current pace for just a few more years,
it will make substantial software products — well beyond a simple project like this one — feasible for a single person
to build and maintain.
