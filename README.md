# 🤖 Agent DevOps IA – Monitoring Intelligent

**Une solution intelligente de supervision DevOps basée sur l'intelligence artificielle pour détecter les anomalies, analyser les logs et faciliter le diagnostic des incidents.**

## 📌 Présentation du projet

**Agent DevOps IA** est une plateforme de monitoring intelligent conçue pour surveiller les performances des systèmes informatiques, détecter automatiquement les comportements anormaux et assister les équipes DevOps dans le diagnostic des incidents.

Le projet combine des outils de supervision, de centralisation des logs et des modèles d'intelligence artificielle afin d'améliorer la visibilité sur l'infrastructure et de faciliter la prise de décision.

Ce projet a été réalisé dans le cadre d'un stage d'été chez **ITGate Group**.

## 🎯 Objectifs

- Surveiller les ressources système : CPU, RAM, disque et réseau.
- Détecter automatiquement les anomalies à l'aide du Machine Learning.
- Analyser les métriques et les logs pour faciliter l'identification des incidents.
- Générer des recommandations intelligentes à l'aide d'un Large Language Model (LLM).
- Fournir un assistant conversationnel pour interroger le système de monitoring.
- Visualiser les performances et les anomalies à travers des tableaux de bord interactifs.
- Consulter l'historique des anomalies et des interactions avec l'assistant.

## ✨ Fonctionnalités principales

### 📊 1. Monitoring et visualisation
- Collecte et suivi des métriques système.
- Visualisation des performances avec Grafana.
- Consultation des logs centralisés avec Kibana.

### 🧠 2. Détection intelligente des anomalies
- Utilisation d'**Isolation Forest** pour identifier les comportements inhabituels.
- Préparation et normalisation des données.
- Évaluation du modèle à l'aide de métriques de classification.
- Détection des anomalies portant sur le CPU, la RAM, le disque et le réseau.

### 🔍 3. Analyse des logs
- Centralisation et indexation des logs.
- Recherche et consultation des événements.
- Corrélation des anomalies détectées avec les métriques et les logs disponibles.

### 💡 4. Recommandations basées sur l'IA
- Utilisation d'un LLM pour analyser le contexte d'un incident.
- Génération de recommandations pour aider au diagnostic et à la résolution des problèmes.
- Intégration d'un modèle local via Ollama.

### 💬 5. Assistant conversationnel
- Interaction en langage naturel avec l'agent IA.
- Consultation de l'historique des conversations.
- Assistance au diagnostic des incidents DevOps.

### 🔐 6. Gestion des utilisateurs
- Authentification sécurisée.
- Gestion des rôles : administrateur et ingénieur DevOps.
- Gestion des utilisateurs et des accès selon les permissions définies.

## 🛠️ Technologies utilisées

| Catégorie | Technologies |
|---|---|
| Backend | Python, FastAPI |
| Frontend | React.js, JavaScript |
| Machine Learning | Scikit-learn, Isolation Forest |
| Intelligence artificielle | Ollama, Llama 3.2 |
| Monitoring | Prometheus, Grafana |
| Gestion des logs | Elasticsearch, Logstash, Kibana (ELK Stack) |
| Cache | Redis |
| Conteneurisation | Docker, Docker Compose |
| Proxy / serveur web | Nginx |
| Base de données | Supabase, SQL |

## 🏗️ Architecture générale

```text
                  Utilisateur / Ingénieur DevOps
                              |
                              v
                       Interface React.js
                              |
                              v
                         API FastAPI
                              |
              +---------------+----------------+
              |
