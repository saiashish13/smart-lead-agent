stages {

    stage('Verify Project') {
        steps {
            sh 'ls -la'
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

    stage('Check Running Containers') {
        steps {
            sh 'docker ps'
        }
    }

    stage('Show Service Logs') {
        steps {
            sh 'docker compose logs --tail=50'
        }
    }
}

post {
    success {
        echo 'Pipeline executed successfully! Application is running.'
    }
    failure {
        echo 'Pipeline failed. Check logs above.'
    }
}