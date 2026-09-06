# FinMate AI

FinMate AI is a personal finance assistant web application built with Next.js. It helps users track expenses, set savings goals, and get quick answers to everyday finance questions through a chat interface powered by a large language model.

## Overview

The application combines a simple expense tracking dashboard with an AI chat assistant. Users can log their spending, upload expense data from a CSV file, monitor progress toward savings goals, and ask the assistant questions about budgeting, credit scores, saving strategies, and other common personal finance topics. The assistant classifies each message and pulls relevant information from a built in knowledge base before generating a response, so answers stay short, direct, and grounded in accurate information.

## Features

Chat assistant that answers finance questions in plain, conversational language without emojis, tables, or headers.

Expense tracking dashboard where users can add, view, and delete expenses by category.

CSV upload support for importing existing expense records.

Visual breakdown of spending using a pie chart.

Savings goals page for creating goals and tracking saved amounts against targets.

User authentication and data storage backed by Supabase.

## Tech Stack

Next.js with the App Router and TypeScript.

Tailwind CSS for styling.

Recharts for data visualization.

Supabase for authentication and database storage.

LangChain and LangGraph for orchestrating the assistant's reasoning flow.

Groq for fast language model inference.

## Project Structure

The app directory contains the pages: the landing page, login and signup pages, the dashboard, the goals page, the chat page, and the chat API route.

The components directory contains reusable UI pieces such as the chat window, sidebar, stat cards, expense chart, and CSV upload widget.

The lib directory contains the core logic: the Supabase client and server helpers, the Groq model configuration, the conversation graph that classifies intent and generates responses, and a small finance knowledge base used to ground the assistant's answers.


## Disclaimer

FinMate AI provides general financial information and guidance for educational purposes. It is not a substitute for advice from a licensed financial professional.
