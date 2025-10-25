pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "warehouster-frontend"
        CONTAINER_NAME = "warehouster-frontend-container"
        APP_PORT       = "3000"
        ENV_FILE_ID    = "warehouster-env"   // Jenkins secret file ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out latest code..."
                git branch: 'dev',
                    credentialsId: 'github-token-Server',
                    url: 'https://github.com/Rajachellan/WareHousterAstroWebsite.git'
            }
        }

        stage('Install Dependencies & Build') {
            steps {
                echo "⚙️ Installing dependencies and building Astro site..."
                withCredentials([file(credentialsId: "${ENV_FILE_ID}", variable: 'ENV_FILE')]) {
                    sh '''
                    echo "🧹 Cleaning previous dependencies..."
                    rm -rf node_modules package-lock.json dist

                    echo "📥 Installing pnpm..."
                    npm install -g pnpm

                    echo "📦 Installing project dependencies..."
                    pnpm install --no-frozen-lockfile

                    echo "⚙️ Injecting environment variables..."
                    cp $ENV_FILE .env

                    echo "🏗️ Building Astro app..."
                    pnpm exec astro build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh '''
                docker build -t $DOCKER_IMAGE .
                '''
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
                echo "🔍 Checking container health..."
                sh '''
                retries=5
                until curl -f http://localhost:$APP_PORT || [ $retries -le 0 ]; do
                    echo "Waiting for frontend to respond..."
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
    }

    post {
        success {
            echo "✅ Frontend successfully deployed at http://localhost:$APP_PORT/"
        }
        failure {
            echo "❌ Deployment failed!"
            sh 'docker system prune -f'
        }
    }
}
