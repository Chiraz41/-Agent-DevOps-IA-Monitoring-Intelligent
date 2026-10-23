# Agent DevOps IA – Monitoring Intelligent

**Plateforme intelligente de supervision DevOps basée sur le Machine Learning, l'analyse des logs et les Large Language Models (LLM).**

## Présentation du projet

Agent DevOps IA est une plateforme de monitoring intelligent développée dans le cadre d'un stage chez ITGate Group.

L'objectif est d'automatiser la surveillance des infrastructures informatiques, de détecter les anomalies dans les métriques système et d'assister les ingénieurs DevOps dans le diagnostic des incidents grâce à l'intelligence artificielle.

La solution combine des outils de monitoring, de centralisation des logs, des modèles de Machine Learning et un assistant conversationnel basé sur un LLM.

## Objectifs

- Surveiller les ressources système : CPU, RAM, disque et réseau.
- Détecter automatiquement les anomalies à l'aide du Machine Learning.
- Centraliser et analyser les logs pour faciliter le diagnostic des incidents.
- Générer des recommandations intelligentes à partir du contexte des incidents.
- Fournir un assistant conversationnel permettant d'interagir avec le système de monitoring.
- Visualiser les métriques et les anomalies à travers des tableaux de bord interactifs.
- Consulter l'historique des anomalies et des interactions avec l'assistant.
- Gérer les utilisateurs et les accès selon leurs rôles.

## Fonctionnalités principales

### 1. Monitoring et visualisation

- Collecte et suivi des métriques système.
- Visualisation des performances avec Grafana.
- Consultation des logs avec Kibana.
- Supervision des services et des composants de l'infrastructure.

### 2. Détection des anomalies

- Utilisation de l'algorithme Isolation Forest pour détecter les comportements inhabituels.
- Analyse des métriques CPU, RAM, disque et réseau.
- Préparation, normalisation et évaluation des données.
- Suivi des anomalies détectées et de leur historique.

### 3. Analyse des logs

- Centralisation et indexation des logs avec la stack ELK.
- Recherche et consultation des événements.
- Mise en relation des métriques et des logs pour faciliter l'identification des causes potentielles des incidents.

### 4. Recommandations intelligentes

- Intégration d'un Large Language Model pour assister le diagnostic.
- Génération de recommandations à partir des informations disponibles.
- Utilisation d'un modèle local via Ollama.

### 5. Assistant conversationnel

- Interaction en langage naturel avec l'agent IA.
- Assistance au diagnostic des incidents DevOps.
- Consultation de l'historique des conversations.

### 6. Authentification et gestion des utilisateurs

- Authentification sécurisée.
- Gestion des rôles administrateur et ingénieur DevOps.
- Gestion des utilisateurs et des autorisations.

## Technologies utilisées

| Catégorie | Technologies |
|---|---|
| Backend | Python, FastAPI |
| Frontend | React.js, JavaScript |
| Machine Learning | Scikit-learn, Isolation Forest |
| Intelligence artificielle | Ollama, Llama 3.2 |
| Monitoring | Prometheus, Grafana |
| Centralisation des logs | Elasticsearch, Logstash, Kibana |
| Cache | Redis |
| Conteneurisation | Docker, Docker Compose |
| Serveur web et reverse proxy | Nginx |
| Base de données | Supabase, SQL |

## Architecture du projet

```text
Utilisateur
    |
    v
Interface React.js
    |
    v
API FastAPI
    |
    +---------------------+
    |          |          |
    v          v          v
Isolation    Ollama      Redis
Forest       / LLM
    |          |
    +-----+----+
          |
          v
Diagnostic et recommandations
          |
          +-------------------+
          |                   |
          v                   v
     Prometheus          Elasticsearch
          |                   |
          v                   v
       Grafana              Kibana
```

## Modèle de détection des anomalies

Le système utilise Isolation Forest, un algorithme de Machine Learning non supervisé adapté à la détection des anomalies.

Le processus comprend les étapes suivantes :

1. Génération et préparation du jeu de données.
2. Analyse exploratoire des données.
3. Génération d'anomalies synthétiques.
4. Préparation et normalisation des variables.
5. Séparation des données en ensembles d'entraînement et de test.
6. Entraînement et optimisation du modèle.
7. Évaluation à l'aide de métriques de performance.
8. Intégration du modèle dans l'application.

Les variables utilisées concernent principalement l'utilisation du CPU, de la RAM, du disque et du réseau.

## Installation et lancement

### Prérequis

- Git
- Docker Desktop
- Docker Compose
- Ollama, si le modèle de langage est exécuté localement sur la machine hôte

### 1. Cloner le dépôt

```bash
git clone <URL_DU_DEPOT_GITHUB>
cd devops_ai_agent
```

### 2. Configurer les variables d'environnement

Créer et configurer les fichiers `.env` nécessaires au fonctionnement de l'application.

Les paramètres peuvent inclure les informations de connexion à la base de données, les paramètres d'authentification et la configuration du modèle de langage.

Ne jamais publier de mots de passe, de clés API ou de secrets dans le dépôt GitHub.

### 3. Lancer l'application

Depuis le répertoire contenant le fichier `docker-compose.yml` :

```bash
docker compose up -d --build
```

### 4. Vérifier les services

```bash
docker compose ps
```

### 5. Accéder aux interfaces

| Service | URL locale |
|---|---|
| API FastAPI | http://localhost:8000 |
| Documentation Swagger | http://localhost:8000/docs |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |
| Kibana | http://localhost:5601 |

Les ports peuvent varier selon la configuration Docker Compose.

## Sécurité

- Authentification et contrôle des accès selon les rôles.
- Protection des mots de passe.
- Utilisation de variables d'environnement pour les informations sensibles.
- Séparation des permissions entre administrateurs et ingénieurs DevOps.

## Perspectives d'amélioration

- Intégration de techniques d'Explainable AI pour interpréter les prédictions.
- Amélioration de la corrélation entre métriques, logs et anomalies.
- Mise en place d'alertes intelligentes en temps réel.
- Enrichissement des recommandations générées par le LLM.
- Extension de la supervision à plusieurs serveurs.

## Informations sur le projet

**Projet :** Agent DevOps IA – Monitoring Intelligent  
**Entreprise d'accueil :** ITGate Group  
**Domaine :** Intelligence artificielle, Machine Learning, DevOps et Observabilité.

---

Ce projet explore l'intégration du Machine Learning et des technologies DevOps afin d'améliorer la supervision des infrastructures informatiques et de faciliter le diagnostic des incidents.
