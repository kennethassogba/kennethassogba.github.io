<!--
title: Async communications are effective
slug: notes/async-communications
date: 2023-04-05
description: Async communications.
categories: MPI
-->

On a good cluster, with enough local work, the wait after non-blocking MPI calls is negligible.

## Context

In my paper submitted to the mc conference, I use domain decomposition for a neutron transport solver [link]. The subdomains exchange data during each matrix-vector product, so communication is frequent. I use non-blocking calls [Algorithm] to overlap those exchanges with local computation. The waiting time I measured was generally negligible [Table].

This note records the waiting times for a case with 900 million unknowns. The results section is still a draft.

## Algorithm

Each subdomain computes its part of the matrix-vector product as follows:

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

The runs used Topaze at TGCC:

- 864 nodes
- Two AMD EPYC 7763 2.45 GHz sockets per node
- 64 cores per socket, for 128 cores per node
- InfiniBand HDR-100 interconnect

## Results without asynchronous progress

(Draft)

The table is still to be added. It will report wait times for `request_in` and `request_out`, and the number of communications or waits, on ranks 0, last/2, and last, with last=size-1.

## Next

- Enable [async progress](https://www.intel.com/content/www/us/en/docs/mpi-library/developer-guide-linux/2021-6/asynchronous-progress-control.html)
- Try non-blocking collectives.
- Try a pipelined linear solver, e.g [pipelined BiCGstab](https://www.sciencedirect.com/science/article/abs/pii/S0167819117300406).
