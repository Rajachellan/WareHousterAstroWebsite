pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "warehouster-frontend"
        CONTAINER_NAME = "warehouster-frontend-container"
        APP_PORT       = "3000"
        GIT_BRANCH     = "dev"
        GIT_URL        = "https://github.com/Rajachellan/WareHousterAstroWebsite.git"
        GIT_CREDENTIAL = "github-token-Server"   // Jenkins credential ID for GitHub
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out code from GitHub..."
                git branch: "${GIT_BRANCH}",
                    credentialsId: "${GIT_CREDENTIAL}",
                    url: "${GIT_URL}"
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                echo "📦 Installing dependencies and building frontend..."
                sh '''
                echo "🧹 Cleaning old files..."
                rm -rf node_modules package-lock.json dist .next build

                echo "📥 Installing pnpm and building..."
                npm install -g pnpm
                pnpm install --no-frozen-lockfile
                pnpm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                echo "🧹 Removing old container if exists..."
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                echo "🚀 Running new container..."
                sh '''
                docker run -d --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:3000 \
                    $DOCKER_IMAGE
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "🔍 Performing health check..."
                sh '''
                retries=5
                until curl -f http://localhost:$APP_PORT || [ $retries -le 0 ]; do
                    echo "⏳ Waiting for frontend to respond... Retries left: $retries"
                    sleep 5
                    retries=$((retries-1))
                done

                if [ $retries -le 0 ]; then
                    echo "❌ Frontend failed to start!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                '''
            }
        }

        stage('Verify Container Status') {
            steps {
                echo "✅ Verifying container status..."
                sh '''
                if [ "$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" != "true" ]; then
                    echo "❌ Container crashed!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                echo "✅ Container is running successfully."
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Frontend successfully deployed and running at http://localhost:$APP_PORT/"
        }
        failure {
            echo "❌ Frontend deployment failed! Check logs above."
        }
    }
}
