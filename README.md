# Bridging the gap between business domains and Knowledge Graphs
### A Knowledge Graph Conference tutorial

This repository contains the materials for KGC 2022 tutorial on building Knowledge Graph from the ground up, just like you would implement any other piece of contemporary software.

## Introduction

Knowledge Graphs are most commonly presented as a flexible alternative to data warehouses or data lakes. Granted, semantic technology offers superior expressiveness and analytic potential but a great effort remains to actually construct the graphs from disparate sources, such as tabular data, XML, relational databases or APIs. This reduces the role of Knowledge Graphs to the equivalent of an OLAP engine, no matter how flexible.

On the other hand, sophisticated software solutions exist dedicated to building Knowledge Graphs from the ground up. Unfortunately, they are sometimes described as “silos” albeit backed by a RDF. still lacking the openness towards interoperability promised by Linked Data. Closed ecosystems, complicated user interfaces and difficult access to the graph itself prevents their usefulness in creating user-facing software fulfilling complex business requirements and data integrations.

In parallel to the evolution of Knowledge Graphs, the software industry in general has been developing many technologies and techniques helping teams deliver the correct solutions their customers need. Modeling approaches, such as Domain-Driven Design tactical patterns and Event Storming, help analyse and understand the business domain. Various implementations arise to put these rich models to life, including event-driven architecture, CQRS, Web APIs, and microservices, to name a few buzzwords. Sadly, with the even increasing number of technologies, frameworks, APIs, etc, data becomes more and more disconnected and isolated. The effect is quite the opposite from the openness and connectivity promised by Knowledge Graphs. This does not mean, however, that there isn’t a great deal of potential in the industry outside semantic technologies, yet it is often overlooked or dismissed.

During this tutorial I would like to present a set of JavaScript tools which provide a flexible and standards-based foundation for building Knowledge Graphs more similar to “traditional” application software than graphy data warehouses. The goals include embedding as much of the business domain as possible in the graph while retaining the ability to capture complex, case-specific logic, precise access control to the graph, and using open standards. At the same time, the development should more closely resemble typical software than powering through complex, specialized graph-building UIs.

Less code, more graph, and one hundred percent Open Source! Everyone is most welcome to contribute to all software used throughout the tutorial.

## Preparations before the conference

Due to time constraints, it is best if all participants come with their local environments prepared. I invite you to follow the steps below to get the codebase up and running.

You will need to prepare:

1. A computer with docker
2. Lando
3. Python 3, pipx, copier
4. Bootstrap from the template

If you have any questions, please do not hesitate to open issues in this repository so that we can spend the allotted conference time as productive as possible.

## Get started

To start, clone this repo and check out `step-0` tag

```
git clone git@github.com:hypermedia-app/kgc-hypermedia-app-tutorial.git
git checkout step-0
```

Or you might prefer to just [explore in the browser](https://a.maze.link/kgc-tutorial-start)
