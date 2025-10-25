pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "warehouster-frontend"
        CONTAINER_NAME = "warehouster-container"
        APP_PORT       = "4321"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'dev', // change to main if needed
                    credentialsId: 'github-creds-frontend',
                    url: 'https://github.com/Rajachellan/WareHousterAstroWebsite.git'
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                sh '''
                echo "🧹 Cleaning previous dependencies..."
                rm -rf node_modules package-lock.json

                echo "📦 Installing pnpm and building Astro app..."
                npm install -g pnpm
                pnpm install --no-frozen-lockfile
                pnpm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "🐳 Building Docker image..."
                docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                echo "🛑 Stopping old container if exists..."
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                echo "🚀 Starting new frontend container..."
                docker run -d --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:4321 \
                    $DOCKER_IMAGE
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "🔍 Checking if frontend is live..."
                retries=10
                until curl -f http://localhost:$APP_PORT || [ $retries -le 0 ]; do
                    echo "Waiting for frontend to respond..."
                    sleep 3
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

        stage('Verify Container') {
            steps {
                sh '''
                echo "🔎 Verifying container status..."
                if [ "$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" != "true" ]; then
                    echo "❌ Container crashed!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                echo "✅ Container is running fine on port $APP_PORT"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Frontend successfully built and running at http://localhost:$APP_PORT/"
        }
        failure {
            echo "❌ Frontend build or container startup failed!"
        }
        always {
            echo "🧹 Cleaning up unused Docker resources..."
            sh 'docker system prune -f || true'
        }
    }
}
