# Context-Aware Smart Recommendation Engine
 
Our context-aware smart recommendation engine is designed to solve the problem of endlessly scrolling through content by delivering highly relevant movie and show suggestions. Our solution leverages deep learning techniques to generate personalized recommendations based on rich contextual features. These include the user's current mood, weather conditions, time of day, and other situational factors such as physical state (e.g., healthy or ill), social context (e.g., watching alone, with a partner, family, or friends), and location (e.g., at home or away). By integrating these dynamic inputs, our system delivers content that aligns more meaningfully with the user's present context, enhancing engagement and satisfaction.



## TABLE OF CONTENTS

|S.No.| Content |
|:--:|:--------------------:|
| 1. | [Overview](#overview) |
| 2. | [Motivaton and Goal](#motivation-and-goal) |
| 3. | [About the Datasets](#about-the-datasets) |
| 4. | [Downloading the Datasets](#downloading-the-datasets)|
| 5. | [Tech/Framework Used](#tech-framework-used) |
| 6. | [Component 1 Description](#component-1-description)|
| 7. | [Component 2 Description](#component-2-description)|
| 8. | [Project Workflow](#project-workflow) |
| 9. | [CNN Architechture of SER Model](#cnn-architecture-of-ser-model)|
| 10. | [Scope/ Improvement](#scope-improvement) |
| 11. | [Team Contributors](#team-contributors) |


## OVERVIEW
The system determines the user's mood based on speech input, which in a real-world deployment would be captured via Alexa voice signals. Using the inferred mood along with other contextual factors—such as time, weather, location, physical and social setting—the system predicts the most relevant genres and recommends personalized content accordingly.

The project consists of two components:
Component 1: Speech Emotion Recogniton
Component 2: Movie Recommendation System

## MOTIVATION AND GOAL

People spend an average of 18 minutes just deciding what to watch, often scrolling endlessly. Around 68% of users quit due to poor recommendations, and the overwhelming number of options makes decision-making even harder. This innovation addresses these challenges by introducing a context-aware filter that enhances existing recommendation systems, making content discovery faster, smarter, and more efficient.

## ABOUT THE DATASETS

DATASET 1(For MR Model):-We have used the RAVDESS (Ryerson Audio-Visual Database of Emotional Speech and Song) dataset that contains 7356 files. It is one of the most common datasets used for this exercise because of its quality of speakers, recording and it has 24 actors of different genders. Here's the filename identifiers as per the official RAVDESS website:

>	Modality (01 = full-AV, 02 = video-only, 03 = audio-only).

>	Vocal channel (01 = speech, 02 = song).

>	Emotion (01 = neutral, 02 = calm, 03 = happy, 04 = sad, 05 = angry, 06 = fearful, 07 = disgust, 08 = surprised).

>	Emotional intensity (01 = normal, 02 = strong). NOTE: There is no strong intensity for the 'neutral' emotion.

>	Statement (01 = "Kids are talking by the door", 02 = "Dogs are sitting by the door").

>	Repetition (01 = 1st repetition, 02 = 2nd repetition).

>	Actor (01 to 24. Odd numbered actors are male, even numbered actors are female).

Here's an example of an audio filename. 02-01-06-01-02-01-12.mp4

DATASET 2(For Movie recommender ):-LDOS-CoMoDa is a context-aware movie recommender dataset designed to capture the emotional and situational state of users during content consumption. It includes real user-item interactions enriched with 12 contextual variables, with a strong focus on user mood, dominant emotions, and the emotional response after watching a movie. This allows for deep personalization based on how users feel—rather than just what they rate.


## DOWNLOADING THE DATASETS
The RAVDESS Dataset can be downloaded from kaggle using the following link

    https://www.kaggle.com/uwrfkaggler/ravdess-emotional-speech-audio

LDOS-CoMoDa dataset is not publicly available.

To request access, contact: andrej.kosir@fe.uni-lj.si


## TECH/ FRAMEWORK USED

|       |       |      |
|:-----:|:-----:|:----:|
|<img src="https://user-images.githubusercontent.com/86526643/135712315-184057b0-2ec3-4dbd-a89f-99f2dbf409c4.png" width="150px">|<img src="https://user-images.githubusercontent.com/86526643/135712327-5974e3c1-e6af-419a-816f-f3b392de355c.png" width="150px">|<img src="https://user-images.githubusercontent.com/86526643/135712364-a4efcd4b-0d26-4ab6-915d-458c04735697.jpeg" width="150px">|
|<img src="https://user-images.githubusercontent.com/86526643/135712351-8703df40-fe71-48e8-800a-ea722435303a.png" width="150px">|<img src="https://user-images.githubusercontent.com/86526643/135712334-a6929aec-e345-42b6-b39e-2cad2ae05472.png" width="150px">|<img src="https://user-images.githubusercontent.com/86526643/135712460-e6c71771-c643-4c9b-806d-787faf5ac7b3.png" width="150px">|
|<img src="https://user-images.githubusercontent.com/86526643/135712409-cd56d94b-3f14-4617-8809-3bb7b89608b2.jpg" width="150px">|<img src="https://user-images.githubusercontent.com/86526643/135712371-a8bede05-4a98-4e79-bfd1-f1a597bd00f0.png" width="150px">|<img src="https://user-images.githubusercontent.com/86526643/135713149-0ba7f309-c62b-46eb-bd13-af2cc79e976f.png" width="150px">|



## COMPONENT 1 DESCRIPTION
### SPEECH EMOTION RECOGNITION
Speech Emotion Recognition (SER) is the task of recognizing the emotional aspects of speech irrespective of the semantic contents.

This component takes an audio input and recognises the emotion of the speaker. The steps involved are as follows:
#### 1. EXPLORATORY DATA ANALYSIS (EDA) OF THE DATASET
>The key features of the audio data are namely, MFCC (Mel Frequency Cepstral Coefficients), Mel Spectrogram and Chroma.
    
#### 2. DATA AUGMENTATION
>Data augmentation is the process by which we create new synthetic data samples by adding small perturbations on our initial training set.
>To generate syntactic data for audio, we can apply noise injection, shifting time, changing pitch and speed.
    
#### 3. FEATURE EXTRACTION
>The acoustic charac-teristics of the speech signal features such as pitch, energy, zero crossing rates, Mel Frequency Cepstral Coeﬃcients and Discrete Wavelet Transform        are extracted to analyze the signal .
     
#### 4. DATA PREPROCESSING
>This involves splitting the dataset into training ans test set, encoding the categorical variables using OneHotEncoder and scaling the values using StandardScaler.
     
#### 5. MODEL BUILDING
>The model is trained using 1D CNN with three convolutional layers and an accuracy score of 82.4% is obtained on the test set. 
>Generally, the average accuracy of the speech to emotion recognition Models is 75%. Thus, we have obtained an optimal accuracy score.


## COMPONENT 2 DESCRIPTION
### MOVIE RECOMMENDER SYSTEM
**Contextual Genre Prediction (CGP)** is the task of mapping high-level user context to the most likely movie genres.

This component receives as input:  
- **Mood** (output from Component 1)  
- **Contextual features** such as weather, time of day, location, social context, physical state, decision context, interaction, endEmo and dominantEmo  

It then outputs the **top-3 predicted genres** via a tuned MLP classifier. When evaluated on LDOS-CoMoDa, it achieves **70.47% top-1 accuracy** (vs. ~60% baseline) and **~90% top-3 hit rate**, while remaining lightweight and supporting incremental retraining.

---

1. **EXPLORATORY DATA ANALYSIS (EDA)**  
   > Examine the distribution of the primary genre (`genre1`), noting class imbalances and rare labels.  
   > Inspect each context feature (e.g. weather, mood) for missing values and value ranges.

2. **FEATURE SELECTION & CLEANING**  
   > Drop irrelevant metadata (`movieID`, `date`, `genre2`, `genre3`, etc.).  
   > Retain only context columns and the target `genre1`.

3. **TARGET ENCODING**  
   > Convert string labels (`genre1`) to integer indices via `LabelEncoder`.  
   > Preserve mapping for later interpretation.

4. **TRAIN/TEST SPLIT**  
   > Perform an **80/20 stratified split** on `genre1` to maintain class balance in both sets.

5. **DATA PREPROCESSING PIPELINE**  
   > **Numeric features** (if any) → `StandardScaler`  
   > **Categorical features** (time, weather, mood, etc.) → `OneHotEncoder(handle_unknown='ignore')`  
   > Combined via a `ColumnTransformer`, ensuring identical transforms at inference.

6. **MODEL BUILDING**  
   > Instantiate an `MLPClassifier(layers=(256,128,64), activation='relu', solver='adam', early_stopping=True, random_state=42)`.  
   > Train on preprocessed training data until convergence or early-stop.

7. **EVALUATION**  
   > **Top-1 metrics**: accuracy, precision, recall, F1 (macro)  
   > **Top-3 hit rate**: fraction where the true genre appears among the model’s top-3 outputs  
   > (Optionally) visualize with confusion matrix and per-class bar charts.

8. **MODEL PERSISTENCE**  
   > Save the full pipeline (scaler + encoder + MLP) via `joblib.dump(...)` for production deployment.

9. **INCREMENTAL RETRAINING**  
   > Implement a retraining function that checks for “≥100 new samples,”  
     concatenates them with the original data, and **refits the pipeline** seamlessly.

---

This workflow delivers a robust, efficient genre-prediction module that can be deployed in real time and continuously improved as new user data arrives.  

 

## PROJECT WORKFLOW
<p align = "center"><img width="549" alt="Screenshot 2025-06-22 at 5 48 32 AM" src="https://github.com/user-attachments/assets/caec97b1-5db2-4c2f-bc4e-ef41e39dfa73" /></p>

## CNN ARCHITECTURE OF SER MODEL
<p align="center"><img src = "https://user-images.githubusercontent.com/86526643/135715935-616a4aa7-3e2f-4372-8c3f-2a6fe93aff63.png" width="500px">
</p>

## SCOPE/ IMPROVEMENT
 


## Team Contributors
>Chirag Paliwal
https://github.com/chirag2483

> Ansh Gadwal 
https://github.com/githubansh





