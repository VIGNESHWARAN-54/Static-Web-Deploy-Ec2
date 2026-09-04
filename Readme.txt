🚀 Static Website Deployment Using Jenkins, Docker & AWS EC2
📌 Project Overview

This project demonstrates how to deploy a simple static web page using:

☁️ AWS EC2
🐳 Docker
🔧 Jenkins
🌐 Nginx
🔗 SCM (GitHub)
📜 Jenkinsfile

The deployment is automated using a Jenkins Pipeline. The source code is stored in SCM, and Jenkins uses the Jenkinsfile to build and deploy the static website inside an Nginx Docker container running on an EC2 instance.

🏗️ Architecture
                    ┌─────────────────┐
                    │     GitHub      │
                    │      (SCM)      │
                    └────────┬────────┘
                             │
                             │ Jenkinsfile
                             ▼
                    ┌─────────────────┐
                    │     Jenkins     │
                    │   Build Job     │
                    └────────┬────────┘
                             │
                             │ Pipeline
                             ▼
              ┌──────────────────────────────┐
              │          AWS EC2             │
              │                              │
              │   ┌──────────────────────┐   │
              │   │       Docker         │   │
              │   │                      │   │
              │   │  ┌────────────────┐  │   │
              │   │  │ Nginx Container │  │   │
              │   │  │                │  │   │
              │   │  │ Static Website │  │   │
              │   │  └────────────────┘  │   │
              │   └──────────────────────┘   │
              └──────────────┬───────────────┘
                             │
                             │ EC2 Public IP
                             ▼
                    ┌─────────────────┐
                    │     Browser     │
                    │  Static Website │
                    └─────────────────┘

static-web-deployment/
│
├── index.html
├── Dockerfile
└── Jenkinsfile

index.html

The static webpage that will be served by Nginx.

Dockerfile

Defines the Docker image used to serve the static website.

Jenkinsfile

Contains the Jenkins Pipeline stages used to automate the deployment.

☁️ EC2 Setup

Before running the Jenkins pipeline, the EC2 machine must be started and configured.

1. Start the EC2 Instance

Start the EC2 instance from the AWS Console.

Make sure the EC2 instance is running before starting the Jenkins pipeline.

2. Connect to EC2

Connect to the EC2 instance using SSH.

ssh -i your-key.pem ec2-user@<EC2-PUBLIC-IP>


The username depends on the AMI being used.

For example:

ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>

☕ Install Java

Jenkins requires Java to run.

For Ubuntu:

sudo apt update
sudo apt install openjdk-17-jdk -y


Verify Java:

java -version

🐳 Install Docker

Install Docker on the EC2 machine.

For Ubuntu:

sudo apt update
sudo apt install docker.io -y


Check Docker:

docker --version

▶️ Start Docker

Start the Docker service:

sudo systemctl start docker


Enable Docker to start automatically after reboot:

sudo systemctl enable docker


Check Docker status:

sudo systemctl status docker

🔐 Give User Permission to Docker

Add the current user to the Docker group:

sudo usermod -aG docker $USER


Log out and log back in for the group membership to take effect.

Verify:

docker ps


If Docker works without sudo, the permission has been configured successfully.

🔄 Restart Docker

Restart the Docker service:

sudo systemctl restart docker


Verify:

sudo systemctl status docker

🔧 Jenkins Configuration

Jenkins is used to automate the build and deployment process.

Create a Jenkins Pipeline Job.

The pipeline obtains the source code from SCM and uses the Jenkinsfile stored in the repository.

Jenkins Pipeline Configuration
Jenkins
   │
   ├── New Item
   │
   ├── Select Pipeline
   │
   ├── Pipeline Definition
   │
   ├── Pipeline script from SCM
   │
   ├── SCM → Git
   │
   └── Repository URL


Set the pipeline definition to:

Pipeline script from SCM


Select:

SCM: Git


Then provide your Git repository URL.

📜 Jenkinsfile

The Jenkinsfile contains multiple stages.

A typical pipeline flow is:

Checkout
   ↓
Build
   ↓
Docker Build
   ↓
Stop Old Container
   ↓
Deploy New Container
   ↓
Verify Deployment


Example Jenkinsfile:

pipeline{
    agent  any
    environment{
        DOCKER_IMAGE_NAME='static-web-ec2:latest'
        DOCKER_CONTAINER_NMAE='static-web'
    }
    stages{
        stage('git_clone'){
            steps{
                git branch: 'main', url: 'https://github.com/VIGNESHWARAN-DEV54/static-web-ec2.git'
            }
        }
        stage('old_container_stop_and_rm'){
            steps{
                sh 'docker stop ${DOCKER_CONTAINER_NMAE} || true'
                sh 'docker rm ${DOCKER_CONTAINER_NMAE} || true'
            }
            
        }
        stage('Docker_image_build'){
            steps{
                sh 'docker build -t ${DOCKER_IMAGE_NAME} . '
            }
        }
        stage('docker_container_run'){
            steps{
                sh 'docker run -itd -p "80:80" --name=${DOCKER_CONTAINER_NMAE} ${DOCKER_IMAGE_NAME}'
            }
            

        }
        

    }
}






Adjust the commands according to your EC2 OS, Jenkins setup, Docker configuration, and repository structure.

🐳 Dockerfile

Example Dockerfile:

FROM nginx:latest

COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80


This uses the official Nginx image and copies the static HTML page into Nginx's default web directory.

🌐 EC2 Security Group

Make sure the EC2 Security Group allows HTTP traffic.

Add an inbound rule:

Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0


For SSH administration, allow:

Type: SSH
Protocol: TCP
Port: 22
Source: Your IP


For production environments, restrict access rather than opening ports unnecessarily.

🚀 Deployment Process

The complete deployment process is:

Step 1 — Start EC2

Start the EC2 instance from AWS.

Step 2 — Prepare EC2

Make sure Java and Docker are installed.

java -version
docker --version


Start/restart Docker if required:

sudo systemctl restart docker

Step 3 — Configure Docker Permission
sudo usermod -aG docker $USER


Log in again and verify:

docker ps

Step 4 — Push Code to SCM

Push the following files to your Git repository:

index.html
Dockerfile
Jenkinsfile

Step 5 — Start Jenkins Job

Run the Jenkins Pipeline job.

Jenkins will:

Checkout the source code from SCM.
Execute the Jenkinsfile.
Run the build stages.
Build the Docker image.
Stop/remove the previous container.
Start a new Nginx container.
Expose the container on port 80.
Verify that the container is running.
🔄 Pipeline Flow
GitHub Repository
       │
       ▼
   Jenkins Job
       │
       ▼
   Checkout SCM
       │
       ▼
      Build
       │
       ▼
 Docker Image Build
       │
       ▼
 Stop Old Container
       │
       ▼
 Remove Old Container
       │
       ▼
 Run New Container
       │
       ▼
   Verify Docker
       │
       ▼
    EC2 :80
       │
       ▼
     Browser
       │
       ▼
 Static Web Page

🌍 Access the Website

After the Jenkins pipeline completes successfully, get the Public IPv4 address of the EC2 instance.

Open a browser and enter:

http://<EC2-PUBLIC-IP>


For example:

http://54.xx.xx.xx


The Nginx container will serve the static webpage.

🔍 Verify Deployment

On the EC2 machine:

Check running containers
docker ps


Expected result:

CONTAINER ID   IMAGE            PORTS
xxxxxxxx       static-web-app   0.0.0.0:80->80/tcp

Check Docker images
docker images

Check container logs
docker logs static-web-container

Test from EC2
curl http://localhost


If the deployment is successful, the HTML content of the static website should be returned.

🎯 Final Result

The final architecture is:

             GitHub / SCM
                  │
                  ▼
              Jenkins
                  │
             Jenkinsfile
                  │
          Multi-Stage Pipeline
                  │
                  ▼
             AWS EC2
                  │
                Docker
                  │
                  ▼
          ┌───────────────┐
          │ Nginx Container│
          │               │
          │ index.html    │
          └───────┬───────┘
                  │
                Port 80
                  │
                  ▼
              Web Browser
                  │
                  ▼
           Static Web Page

