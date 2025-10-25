pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "warehouster-frontend"
        CONTAINER_NAME = "warehouster-frontend-container"
        APP_PORT       = "3000"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'dev',
                    url: 'https://github.com/Rajachellan/WareHousterAstroWebsite.git'
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                sh '''
                echo "🧹 Cleaning previous dependencies..."
                rm -rf node_modules package-lock.json

                echo "📦 Installing pnpm locally and building Astro app..."
                npm install pnpm
                npx pnpm install --no-frozen-lockfile
                npx pnpm run build
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
                echo "Stopping old container if exists..."
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                echo "Running new container..."
                docker run -d --name $CONTAINER_NAME \
                    --restart always \
                    -p $APP_PORT:3000 \
                    $DOCKER_IMAGE
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Waiting for container to start..."
                retries=5
                until curl -f http://localhost:$APP_PORT || [ $retries -le 0 ]; do
                    echo "Waiting for frontend to respond..."
                    sleep 5
                    retries=$((retries-1))
                done

                if [ $retries -le 0 ]; then
                    echo "Frontend failed to start!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                '''
            }
        }

        stage('Verify Container') {
            steps {
                sh '''
                echo "Checking if container is still running..."
                if [ "$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" != "true" ]; then
                    echo "❌ Container crashed!"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                echo "✅ Container is running fine."
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Frontend Deployment Successful! App running at http://localhost:$APP_PORT/"
        }

        failure {
            echo "❌ Frontend Deployment Failed!"
        }
    }
}
