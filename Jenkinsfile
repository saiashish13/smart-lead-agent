```groovy
pipeline {
    agent any

    environment {
        DOCKER_USER = 'pabbojuuday26'
    }

    stages {

        stage('Verify Project') {
            steps {
                echo '📁 Verifying project files...'
                sh 'ls -la'
            }
        }

        stage('Build Images') {
            steps {
                echo '⚙️ Building Docker images...'
                sh 'docker-compose build'
            }
        }

        stage('Check Images') {
            steps {
                echo '🔍 Checking built images...'
                sh 'docker images'
            }
        }

        stage('Tag Images') {
            steps {
                echo '🏷️ Tagging images...'
                sh '''
                docker tag smart-lead-pipeline_frontend:latest pabbojuuday26/frontend:latest
                docker tag smart-lead-pipeline_backend:latest pabbojuuday26/backend:latest
                '''
            }
        }

        stage('Docker Login') {
            steps {
                echo '🔐 Logging into Docker Hub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                echo '🚀 Pushing images to Docker Hub...'
                sh '''
                docker push pabbojuuday26/frontend:latest
                docker push pabbojuuday26/backend:latest
                '''
            }
        }

        stage('Run Containers') {
            steps {
                echo '🚀 Starting application...'
                sh 'docker-compose up -d'
            }
        }

        stage('Verify Running') {
            steps {
                echo '🔍 Checking running containers...'
                sh 'docker ps'
            }
        }

        stage('Show Logs') {
            steps {
                echo '📜 Showing logs...'
                sh 'docker-compose logs --tail=50'
            }
        }
    }

    post {
        success {
            echo '✅ SUCCESS: Images pushed & app running!'
        }
        failure {
            echo '❌ FAILED: Check logs above'
        }
    }
}
```
