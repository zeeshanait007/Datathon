# Crime Intelligence Copilot

An AI-powered investigative assistant and enterprise web application for law enforcement agencies.

## Features
- **Conversational AI Copilot**: Query crime databases using natural language with explainable AI (sources and confidence scores).
- **Executive Dashboard**: Visualize crime trends and statistics with interactive charts.
- **FIR Search & Details**: Advanced search filtering and detailed investigation views.
- **Criminal Network Analysis**: Interactive graph visualization of suspects, victims, and crimes.
- **Hotspot Analysis**: Geospatial mapping of crime incidents using Leaflet.
- **Offender Profiles**: Risk assessment scoring and crime history for suspects.
- **Multilingual Support**: English and Kannada translations.

## Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts, React-Leaflet, Force-Graph-2D.
- **Backend**: FastAPI, Python, SQLAlchemy.
- **Database**: PostgreSQL (with pgvector), Neo4j.
- **Deployment**: Docker Compose.

## Prerequisites
- Docker and Docker Compose installed.
- **Important**: Ensure you have at least **5-10 GB of free disk space** for Docker images and volumes.

## Getting Started

1. **Start the Infrastructure**
   Build and spin up the containers:
   ```bash
   docker-compose up --build -d
   ```

2. **Seed the Database (Optional but Recommended)**
   The system includes a script to generate 1000 FIRs and a sample criminal network graph.
   ```bash
   docker-compose exec backend python scripts/seed.py
   ```

3. **Access the Application**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000](http://localhost:8000)
   - **Neo4j Browser**: [http://localhost:7474](http://localhost:7474)

4. **Login**
   - **Username**: investigator1
   - **Password**: password (mock login works without real DB connection for demo purposes)
