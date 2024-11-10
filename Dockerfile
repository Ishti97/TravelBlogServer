# Start with a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma files and the rest of the app
COPY prisma ./prisma
COPY . .

# Generate Prisma client and apply migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Expose the backend port
EXPOSE 3000

# Start the backend service
CMD ["node", "app.js"]
