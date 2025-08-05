// Jenkinsfile

pipeline {
    agent any

    stages {
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
        stage('Clean Trace Folder') {
            steps {
                sh 'if [ -d trace ]; then rm -rf trace; fi'
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
                archiveArtifacts artifacts: "playwright-report/**", allowEmptyArchive: true
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