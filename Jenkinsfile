pipeline{
    agent{label 'aws-ec2'}
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



