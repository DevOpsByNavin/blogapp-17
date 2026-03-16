pipeline {
    agent any
    
    environment {
        GITHUB_REPO = 'https://github.com/DevOpsByNavin/blogapp-17.git'
        HARBOR_REGISTERY = 'harbor.nabinpoudel004.com.np/'
        HARBOR_PROJECT = 'blog-app'
        HARBOR_USER = 'robot$harbor-robot'
        EC2_USER = 'admin'
        EC2_HOST = '13.126.240.245'
        EC2_WORKDIR = 'BlogApp'
    }
    
    stages {
        stage("Checkout") {
            steps {
                git url: "${GITHUB_REPO}",  branch: 'main'
            }
        }
        
        stage("Image Naming") {
            steps {
                script {
                    env.BACKEND1_IMG = "${HARBOR_REGISTERY}/${HARBOR_PROJECT}/blog-backend1:${BUILD_NUMBER}"
                    env.BACKEND1_LATEST = "${HARBOR_REGISTERY}/${HARBOR_PROJECT}/blog-backend1:latest"

                    env.BACKEND2_IMG = "${HARBOR_REGISTERY}/${HARBOR_PROJECT}/blog-backend2:${BUILD_NUMBER}"
                    env.BACKEND2_LATEST = "${HARBOR_REGISTERY}/${HARBOR_PROJECT}/blog-backend2:latest"

                    env.NGINX_IMG = "${HARBOR_REGISTERY}/${HARBOR_PROJECT}/blog-nginx:${BUILD_NUMBER}"
                    env.NGINX_LATEST = "${HARBOR_REGISTERY}/${HARBOR_PROJECT}/blog-nginx:latest"
                }
            }
        }

        stage("Build images") {
            steps {
                sh '''
                    docker build \
                    -t "$BACKEND1_IMG" \
                    -t "$BACKEND1_LATEST" \
                    -f services/backend1/Dockerfile .
                    
                    docker build \
                    -t "$BACKEND2_IMG" \
                    -t "$BACKEND2_LATEST" \
                    -f services/backend2/Dockerfile .
                    
                    docker build \
                    -t "$NGINX_IMG" \
                    -t "$NGINX_LATEST" \
                    -f infra/nginx/Dockerfile .
                '''
            }
        }
        
        stage("Push image to harbor") {
            steps {
                withCredentials([string(credentialsId: 'harbor', variable: 'HARBOR_API_KEY')]) {

                    sh '''
                        echo "${HARBOR_API_KEY}" | docker login "${HARBOR_REGISTERY}" --username "${HARBOR_USER}" --password-stdin

                        docker push "${BACKEND1_IMG}"
                        docker push "${BACKEND1_LATEST}"

                        docker push "${BACKEND2_IMG}"
                        docker push "${BACKEND2_LATEST}"

                        docker push "${NGINX_IMG}"
                        docker push "${NGINX_LATEST}"

                        docker logout "${HARBOR_REGISTERY}"
                    '''
            }
         }
            
        }

        stage("Deploy project") {
            steps {
                sshagent(credentials: ['deploy-ec2-key']) {
                        withCredentials([string(credentialsId: 'harbor', variable: 'HARBOR_API_KEY')]) {
                            sh '''
                                scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null docker-compose.yml ${DEPLOY_USER}@${DEPLOY_HOST}:${EC2_WORKDIR}/docker-compose.yml

                                ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "${EC2_USER}@${EC2_HOST} "
                                    cd ${EC2_WORKDIR}
                                    echo ${HARBOR_API_KEY} | docker login ${HARBOR_REGISTERY} --username ${HARBOR_USER} --password-stdin
                                    docker compose up -d --force-recreate --remove-orphans
                                    docker image prune -f
                                    docker logout ${HARBOR_REGISTERY}
                                "
                    '''
                    }
                }
            }
        }
    }
}