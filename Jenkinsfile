pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/saiashish13/smart-lead-agent.git'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build & Run Containers') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

        stage('Check Running') {
            steps {
                sh 'docker ps'
            }
        }
    }
}