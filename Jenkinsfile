pipeline {
    agent any

    stages {

        stage('Verify Project') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify Running') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Show Logs') {
            steps {
                sh 'docker compose logs --tail=50'
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully 🚀'
        }
        failure {
            echo 'Pipeline failed ❌'
        }
    }
}