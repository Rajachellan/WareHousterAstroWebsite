pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "warehouster-frontend"
        CONTAINER_NAME = "warehouster-frontend-container"
        APP_PORT       = "4321"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out latest code..."
                git branch: 'dev',
                    credentialsId: 'github-cred-frontend-warehouster',
                    url: 'https://github.com/Rajachellan/WareHousterAstroWebsite.git'
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                echo "⚙️ Installing dependencies and building Astro site..."
                sh '''
                echo "🧹 Cleaning up old files..."
                rm -rf node_modules dist package-lock.json pnpm-lock.yaml
                npx pnpm store prune || true

                echo "📥 Installing pnpm locally..."
                npm install pnpm --save-dev

                echo "📦 Installing dependencies (single-threaded for CI)..."
                npx pnpm install --no-frozen-lockfile --workspace-concurrency 1

                echo "🏗️ Building Astro site..."
                npx pnpm exec astro build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh "docker build -t $DOCKER_IMAGE ."
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                echo "🧹 Removing old container if it exists..."
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                echo "🚀 Running new container on port $APP_PORT..."
                sh '''
                docker run -d --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:4321 \
                    $DOCKER_IMAGE
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "🔍 Checking if app is live..."
                sh '''
                retries=5
                until curl -f http://localhost:$APP_PORT || [ $retries -le 0 ]; do
                    echo "Waiting for frontend to start..."
                    sleep 5
                    retries=$((retries-1))
                done

                if [ $retries -le 0 ]; then
                    echo "❌ App failed to start!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                '''
            }
        }
    }

    post {
        success {
            echo "✅ WareHouster frontend deployed successfully at http://localhost:$APP_PORT/"
        }
        failure {
            echo "❌ Deployment failed — cleaning up..."
            sh 'docker system prune -f'
        }
    }
}
