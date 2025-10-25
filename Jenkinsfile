pipeline {
    agent any
    environment {
        IMAGE_NAME = "astro-app:latest"
        CONTAINER_NAME = "astro-app-container"
        PORT = "4321"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh """
                    echo "🧹 Cleaning old files..."
                    rm -rf node_modules package-lock.json dist

                    echo "📥 Installing pnpm and building..."
                    npm install pnpm --save-dev
                    npx pnpm install --no-frozen-lockfile
                    npx pnpm run build
                """
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME ."
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh """
                    if [ \$(docker ps -aq -f name=$CONTAINER_NAME) ]; then
                        docker stop $CONTAINER_NAME
                        docker rm $CONTAINER_NAME
                    fi
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh "docker run -d --name $CONTAINER_NAME -p $PORT:4321 $IMAGE_NAME"
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Checking if container is running..."
                    docker ps -f name=$CONTAINER_NAME
                """
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up dangling Docker resources..."
            sh "docker system prune -f"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
