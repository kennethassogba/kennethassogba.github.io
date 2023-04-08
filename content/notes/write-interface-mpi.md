<!--
title: Write a header-only object oriented interface around MPI
slug: notes/write-interface-mpi
date: 2023-04-07
description: Write interface around MPI.
categories: C++, MPI
-->

(in progress)

**`tl;dr: I developed a simple header-only interface for MPI in C++.`**

The developments are availible here [human.mpi](https://github.com/kennethassogba/human.mpi)

MPI, or Message Passing Interface, is a standardized library for writing parallel programs in a distributed environment. It has become a standard in scientific computing and many legacy computing codes are progressively integrating MPI in view of the move to distributed computing architectures.

## Problem

The addition of MPI communications within an existing computational code can lead to difficulties in readability and maintainability. This is partly because the physics (or math) + communications code mix is difficult to read. A good way to integrate MPI into existing code can be to encapsulate the MPI functions in a class with a simple interface. This is what Boost::MPI offers, for example.

## Proposal

I propose here a header-only interface - so easy to integrate in an existing code - which provides a simpler way to write MPI messages.

The development of an object-oriented interface for MPI could potentially make it easier for developers to write parallel programs using MPI, as the wrapper could handle some of the more complex details of the library.

In addition this could also potentially make it easier to port existing MPI programs to different platforms or environments, as the wrapper would provide a consistent interface that is independent of the underlying implementation of MPI.

## A simple usage example

```cpp
#include "human/mpi.hpp"
#include <string>

int main() {

 human::mpi::communicator world();
 auto rank = world.rank();
 auto size = world.size();
 std::cout << "Process " << rank << "/" << size << std::endl;
 
 std::string msg;
 if (world.rank() == world.root()) msg = "Hello";
 
 world.bcast(msg);
 std::cout << "P" << rank << " " << msg << std::endl;
 
 world.display();
 return 0;
}
```

To use this wrapper, you would first need to include the header file that contains the wrapper class. Then, you can create an instance of the wrapper class by passing the **`argc`** and **`argv`** arguments from the **`main`** function to the constructor. This will initialize the MPI library and allow you to use the wrapper's **`Send`** and **`Receive`** methods to communicate with other processes. When the wrapper instance goes out of scope (e.g., at the end of the **`main`** function), the destructor will be called, which will finalize the MPI library.

Here is an example of how to use the wrapper to

In progress
