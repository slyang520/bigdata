

# Rancher安装创建K8s

```shell
# cestos 7.4

# setp1. 对每台加入k8s 集群的机器执行
systemctl stop firewalld && systemctl disable firewalld && swapoff -a

# setp2. 安装docker 

# setp3. 安装Rancher
sudo docker run -d --restart=unless-stopped -p 8085:80 -p 445:443 --privileged rancher/rancher:v2.5.1


# error01
docker: Error response from daemon: driver failed programming external connectivity on endpoint suspicious_mclaren (0682c58b1e8eed92897f684e0d9afdd626ff30b2b90e6ca7ac8fec30fecae48f): (iptables failed: iptables --wait -t nat -A DOCKER -p tcp -d 0/0 --dport 8085 -j DNAT --to-               destination 172.17.0.2:80 ! -i docker0: iptables: No chain/target/match by that name.

sudo iptables -t filter -F
sudo iptables -t filter -X
systemctl restart docker

# Node: k8s 集群至少一个 controller、etcd、worker

```


### 私有仓库授权配置

```
kubectl create secret docker-registry <secret名字> --namespace=<命名空间名字> \
  --docker-server=<你的镜像仓库服务器> \
  --docker-username=<你的用户名> \
  --docker-password=<你的密码> \
  --docker-email=<你的邮箱地址>

指定私有库名字授权
spec:
   template:
      spec:
        imagePullSecrets:
            - name: <secret名字>	
```

### 环境变量使用 configMap 
```
场景：抽离公共参数配置项，便于统一修改
```

```yaml

env:
  - name: nacos.namespace
    valueFrom:
      configMapKeyRef:
        name: <your_configMapName>
        key: <configMapName_key>

```
