// Jenkinsfile

pipeline {
    agent any

    environment {
        NODE_VERSION = 'lts/*'
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
        PLAYWRIGHT_REPORT = 'playwright-report'
        TRACE_DIR = 'trace'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Set up Node.js') {
            steps {
                // Requires NodeJS plugin in Jenkins and a configured NodeJS tool named 'nodejs'
                tool name: 'nodejs', type: 'nodejs'
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install --with-deps'
            }
        }
        stage('Run Playwright tests') {
            steps {
                sh 'npx playwright test'
            }
        }
        stage('Generate Allure report') {
            steps {
                // Assumes allure-commandline is installed globally or available in PATH
                sh 'npx allure generate allure-results --clean -o allure-report'
            }
        }
        stage('Archive Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
        stage('Archive Playwright Report') {
            steps {
                archiveArtifacts artifacts: "${PLAYWRIGHT_REPORT}/**", allowEmptyArchive: true
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
            archiveArtifacts artifacts: "${ALLURE_REPORT}/**", allowEmptyArchive: true
            archiveArtifacts artifacts: "${PLAYWRIGHT_REPORT}/**", allowEmptyArchive: true
            archiveArtifacts artifacts: "${TRACE_DIR}/**", allowEmptyArchive: true
        }
    }
}