pipeline {
    agent any
    tools {
        nodejs "NodeJS Default"
    }

    stages {

        stage('Install Playwright') {
            steps {
                bat '''
                    npx playwright install
                '''
            }
        }

        stage('Clean Trace Folder') {
            steps {
                bat 'if exist trace rmdir /s /q trace'
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
                expression { fileExists('trace') }
            }
            steps {
                archiveArtifacts artifacts: 'trace/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Allure and trace artifacts are archived."
        }
    }
}