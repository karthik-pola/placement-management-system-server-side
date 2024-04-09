def add_node(v):
    global ncount
    if v in nodes:
        print("node unsi ra babu")
    else:
        ncount = ncount+1
        nodes.append(v)
        for n in graph:
            n.append(0)
        temp=[]
        for i in range(ncount):
            temp.append(0)
        graph.append(temp)


def add_edge(v1,v2):
    if v1 not in nodes:
        print("adhi avadama")
    elif v2 not in nodes:
        print("adhi avadama")
    else:
        index1=nodes.index(v1)
        index2=nodes.index(v2)
        graph[index1][index2]=1
        graph[index2][index1]=1
    
def printg():
    for i in range(ncount):
        for j in range(ncount):
            print(graph[i][j],end=" ")
        print()

def sol(idx1,idx2):
    temp=idx2
    for i in range(ncount):
        if graph[idx2][i]==1:
            print("yahoo")
            if idx1==i:
                print("yes")
                break
            sol(idx1,i)
    print("NO")   
    
    


nodes=[]
graph=[]
ncount=0
print("okapudu")
print(nodes)
print(graph)
print("ipudu chudu")
add_node(1)
add_node(2)
add_node(3)
add_node(4)
add_node(5)
add_node(6)
add_node(7)
add_edge(0,1)
add_edge(1,3)
add_edge(0,2)
add_edge(0,6)
add_edge(6,4)
add_edge(6,5)
sol(0,6)
print(nodes)
print(graph)
printg()


















        
