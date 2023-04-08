<!--
title: Async communications are effective
slug: notes/async-communications
date: 2023-04-05
description: Async communications.
categories: MPI
-->
Draft

Dans l'article que j'ai soumis a la conference mc, j'applique une methode decomposition de domain vanilla a solveur de transport de neutron [link]. Les sous-domaines sont couples entre eux aux niveau le plus interne de la resolution, c'est a dire pendant les produits matrices vecteurs. Il y a donc enormement de communications et on pourrait s'attrendre a ce que l'overhead soit eleve. Mais les communications sont fait en non blocquant [algo], et le temps d'attente est en general negligeable. Pour un cas a 900 millions d'inconnues, le temps d'attente sur le processus de rank temps d
Resultats
Voyons de plus pres ce qui se passe avec un cas simple

Next with async progress enable
