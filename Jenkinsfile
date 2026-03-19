pipeline {
    agent any
    
    environment {
        GITHUB_REPO = 'https://github.com/DevOpsByNavin/blogapp-17.git'
        HARBOR_REGISTRY = 'harbor.nabinpoudel004.com.np'
        HARBOR_PROJECT = 'blog-app'
        HARBOR_USER = 'admin'
        EC2_USER = 'admin'
        EC2_HOST = '13.126.240.245'
        EC2_WORKDIR = 'BlogApp'
    }
    
    stages {
        
        // stage("Checkout") {
        //     steps {
        //         git url: "${GITHUB_REPO}",  branch: 'main'
        //     }
        // }
        
        // stage("OWASP dependency check") {
        //     steps {
                
        //         withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
        //             sh '''
        //                 mkdir -p /var/lib/jenkins/dependency-check-data
        //                 mkdir -p odc-report

        //                 docker run --rm \
        //                     --volume "$WORKSPACE":/src:z \
        //                     --volume "$WORKSPACE"/odc-report:/report:z \
        //                     --volume /var/lib/jenkins/dependency-check-data:/usr/share/dependency-check/data:z \
        //                     -e NVD_API_KEY="${NVD_API_KEY}" \
        //                     owasp/dependency-check:12.1.0 \
        //                     --format HTML \
        //                     --scan /src/services/backend1 \
        //                     --scan /src/services/backend2 \
        //                     --scan /src/services/frontend \
        //                     --nvdApiKey "${NVD_API_KEY}" \
        //                     --out /report
        //         '''
        //         }
        //     }
        // }

        stage("Install Dependency for ODC") {
            steps {
                sh '''
                    (cd services/frontend && npm ci --legacy-peer-deps)
                    (cd services/backend1 && npm ci)
                    (cd services/backend2 && npm ci)
                '''
            }
        }

        stage("OWASP dependency check") {
            steps {
                withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
                    sh 'mkdir -p odc-report'

                    dependencyCheck (
                        odcInstallation: 'blogapp-17',
                        additionalArguments: '''
                            --format HTML
                            --format XML
                            --scan ./services/backend1 
                            --scan ./services/backend2 
                            --scan ./services/frontend
                            --out odc-report
                            --data /var/lib/jenkins/odc-data
                            --nvdApiKey ${NVD_API_KEY}
                    ''')

                    dependencyCheckPublisher(
                        pattern: 'odc-report/dependency-check-report.xml',
                        stopBuild: false
                    )
                }
            }
        }

        stage("SonarQube analysis") {
            environment {
                SCANNER_HOME = tool 'sonarqube-scanner'
            }

            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
            }
        }

        stage("SonarQube Quality Gate") {
            steps {
                timeout(time:30, unit:'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage("Image Naming") {
            steps {
                script {
                    env.BACKEND1_IMG = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}/blog-backend1:${BUILD_NUMBER}"
                    env.BACKEND1_LATEST = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}/blog-backend1:latest"

                    env.BACKEND2_IMG = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}/blog-backend2:${BUILD_NUMBER}"
                    env.BACKEND2_LATEST = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}/blog-backend2:latest"

                    env.NGINX_IMG = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}/blog-nginx:${BUILD_NUMBER}"
                    env.NGINX_LATEST = "${HARBOR_REGISTRY}/${HARBOR_PROJECT}/blog-nginx:latest"
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
                    
                    cat > services/frontend/.env <<EOF
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ZW5nYWdlZC1mbHktMzMuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_API_URL=http://13.126.240.245
EOF

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
                        echo "${HARBOR_API_KEY}" | docker login "${HARBOR_REGISTRY}" --username "${HARBOR_USER}" --password-stdin

                        docker push "${BACKEND1_IMG}"
                        docker push "${BACKEND1_LATEST}"

                        docker push "${BACKEND2_IMG}"
                        docker push "${BACKEND2_LATEST}"

                        docker push "${NGINX_IMG}"
                        docker push "${NGINX_LATEST}"

                        docker logout "${HARBOR_REGISTRY}"
                    '''
            }
         }
            
        }

        stage("Deploy project") {
            steps {
                sshagent(credentials: ['deploy-ec2-key']) {
                        withCredentials([string(credentialsId: 'harbor', variable: 'HARBOR_API_KEY')]) {
                            sh '''
                                scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null docker-compose.yml ${EC2_USER}@${EC2_HOST}:${EC2_WORKDIR}/docker-compose.yml

                                ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "${EC2_USER}@${EC2_HOST}" "
                                    ls
                                    cd ${EC2_WORKDIR}
                                    cat > .env <<EOF
BACKEND1_IMG=${BACKEND1_IMG}
BACKEND2_IMG=${BACKEND2_IMG}
NGINX_IMG=${NGINX_IMG}
EOF

                                docker compose config
                                printf '%s' '${HARBOR_API_KEY}' | docker login '${HARBOR_REGISTRY}' --username '${HARBOR_USER}' --password-stdin

                                docker compose down --remove-orphans
                                docker compose up -d
                                docker image prune -f -a
                                docker logout ${HARBOR_REGISTRY}                               
                                "
                    '''
                    }
                }
            }
        }
    }
}