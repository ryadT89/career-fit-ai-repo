# Use a Python 3.9 base image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r /code/requirements.txt

# Copy the entire project into the container
COPY . /code/

# Set the PYTHONPATH to the /code directory to ensure FastAPI can find the app
ENV PYTHONPATH=/code

# Expose the FastAPI application port
EXPOSE 8000

# Command to run FastAPI using Uvicorn (change path to server.app)
CMD ["python", "/code/app/main.py"]
