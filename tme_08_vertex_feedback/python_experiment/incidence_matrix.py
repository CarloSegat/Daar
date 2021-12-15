import networkx as nx
import matplotlib.pyplot as plt
from scipy.linalg import null_space
from sympy import Matrix
import numpy as np

nodes = [0, 1, 2, 3, 4]
edges = [[0,1], [1,2], [2,0], [1,0], [2,1], [0,2],  [3,4], [4,3],[3,0],[0,3],[0,4],[4,0]]

# original graph
G = nx.DiGraph()
G.add_nodes_from(nodes)
G.add_edges_from(edges)
nx.draw(G, with_labels=True)
plt.show()

incidence_matrix = nx.incidence_matrix(G, oriented=True)
# print("incidence: ", incidence_matrix.toarray())
simpy_matrix = Matrix(incidence_matrix.toarray())
# print(simpy_matrix)
_rref = simpy_matrix.rref()
# print("pivot columns ", _rref[1])

incidence_loopless = incidence_matrix[:, _rref[1]].toarray()
incidence_loopless = np.absolute(incidence_loopless)
#print("incidence_loopless: ", incidence_loopless)

adjacency_matrix_loopless = (np.dot(incidence_loopless, incidence_loopless.T) > 0).astype(int)
np.fill_diagonal(adjacency_matrix_loopless, 0)
# print(adjacency_matrix_loopless)
G2 = nx.Graph(adjacency_matrix_loopless)
nx.draw(G2, with_labels=True)
plt.show()