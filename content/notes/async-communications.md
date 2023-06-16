<!--
title: Async communications are effective
slug: notes/async-communications
date: 2023-05-05
description: Async communications.
categories: MPI
-->

**`tl;dr: On a good cluster, with enough local work, the waiting time following async communications is negligible.`**

## Context

In the paper I submitted to the mc conference, I apply a simple domain decomposition method for neutron transport solver [link]. The subdomains are coupled together at the innermost level of resolution, i.e. during the matrix-vector products. So there is a lot of communication and one would expect the overhead to be high. The communications are however made in non-blocking mode [Algorithm], and the waiting time measured is generally negligible [Table].

Let us present here the waiting times measured on a case with 900 million unknowns.

## Algorithm

The Matrix-Vector product from the point of view of a subdomain

```cpp
for(const auto& subdomain : domain_neighbors)
{
  mpi::request_in[i] = mpi::world.irecv(x_upwind); // async
  // Copy outgoing part of x in the x_out buffer
  mpi::request_out[i] = mpi::world.isend(x_out); // async
  i++;
}

y += A_diag * x; // local work

mpi::world.waitall(request_in);
mpi::world.waitall(request_out);

y += A_offd * x_upwind;
```

## Cluster

Topaze @TGCC

- 864 nodes, each housing two
- AMD EPYC 7763 2.45 GHz sockets
- equipped with 64 cores each => 128 cores/node
- Interconnect: InfiniBand HDR-100 network

## Results with no asynchonous progress

(Draft)

Table wait (request_in, request_out) time on process 0, last/2, last.
number of communication or wait
The waiting time on the process of rank time 0, last/2, last with last=size-1.

## Next

- Enable [async progress](https://www.intel.com/content/www/us/en/docs/mpi-library/developer-guide-linux/2021-6/asynchronous-progress-control.html)
- Try non-bloquing collectives.
- Try a pipelined linear solver, e.g [pipelined BiCGstab](https://www.sciencedirect.com/science/article/abs/pii/S0167819117300406).
