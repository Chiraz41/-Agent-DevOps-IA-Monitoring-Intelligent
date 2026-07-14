def build_prompt(metrics, severity, logs):

    prompt = f"""
You are a Senior DevOps Engineer.

Analyze the following monitoring information.

Metrics

CPU : {metrics['cpu']} %

RAM : {metrics['ram']} %

Disk : {metrics['disk']} %

Severity : {severity}

Logs

{logs}

Tasks

1. Explain the anomaly.

2. Identify the probable root cause.

3. Estimate the impact.

4. Recommend corrective actions.
"""

    return prompt