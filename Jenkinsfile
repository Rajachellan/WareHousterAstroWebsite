pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        PRERENDER = 'false' // Disable prerendering dynamic routes to avoid build errors
        PNPM_HOME = "${env.WORKSPACE}/.pnpm"
        PNPM_STORE = "${env.WORKSPACE}/.pnpm-store" // PNPM cache
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '🔄 Checking out repository...'
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/dev']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Rajachellan/WareHousterAstroWebsite.git',
                        credentialsId: 'github-cred-frontend-warehouster'
                    ]]
                ])
            }
        }

        stage('Setup Node & PNPM') {
            steps {
                echo '⚡ Setting up Node.js and PNPM...'
                sh '''
                    curl -fsSL https://get.pnpm.io/install.sh | sh -
                    export PATH="$HOME/.local/share/pnpm:$PATH"
                    node -v
                    npm -v
                    pnpm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies with PNPM cache...'
                // Use Jenkins cache directory for PNPM store
                sh '''
                    mkdir -p $PNPM_STORE
                    rm -rf node_modules dist package-lock.json pnpm-lock.yaml
                    npx pnpm store prune
                    npx pnpm install --shamefully-hoist --reporter=append-only --store $PNPM_STORE
                '''
            }
        }

        stage('Build Astro Site') {
            steps {
                echo '🏗️ Building Astro site...'
                sh '''
                    npx pnpm exec astro build -- --no-prerender
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image with cache...'
                sh '''
                    docker build --pull --cache-from warehouster-frontend:latest -t warehouster-frontend:latest .
                '''
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                echo '🛑 Stopping old container if it exists...'
                sh '''
                    docker stop warehouster-frontend || true
                    docker rm warehouster-frontend || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                echo '▶️ Running new container...'
                sh '''
                    docker run -d --name warehouster-frontend -p 80:80 warehouster-frontend:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '✅ Performing health check...'
                sh '''
                    curl -f http://localhost || exit 1
                '''
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up unused Docker images...'
            sh '''
                docker image prune -f
                docker container prune -f
            '''
        }
        failure {
            echo '❌ Deployment failed.'
        }
        success {
            echo '🎉 Deployment succeeded!'
        }
    }
}
