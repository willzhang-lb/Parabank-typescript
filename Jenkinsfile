pipeline {
    agent any
    tools {
        nodejs "NodeJS Default"
    }
    
    environment {
        ENV = 'qa'  // Set environment variable for all steps
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright') {
            steps {
                bat '''
                    npx playwright install
                '''
            }
        }

        stage('Clean Test Results Folder') {
            steps {
                bat 'if exist test-results rmdir /s /q test-results'
            }
        }

        stage('Run Playwright tests') {
            steps {
                bat 'npx playwright test'
            }
        }

        stage('Generate Allure report') {
            steps {
                bat 'npx allure generate allure-results allure-report'
            }
        }

        stage('Archive Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }

        stage('Archive Playwright Traces') {
            when {
                expression { fileExists('test-results') }
            }
            steps {
                archiveArtifacts artifacts: 'test-results/**.zip', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Allure and trace artifacts are archived."
        }
    }
}