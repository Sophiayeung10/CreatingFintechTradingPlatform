===========================================================
ECE 434-579 Spring 2026 | Project 1: Linux & IPC
Memebers: 
Daniel Han <dh959@scarletmail.rutgers.edu>
Sophia Yeung <hy495@scarletmail.rutgers.edu>
Finnegan Beifus <frb43@scarletmail.rutgers.edu>
ELLIS GAINES <ekg51@scarletmail.rutgers.edu>
RISHI MUKHERJEE <rm1648@scarletmail.rutgers.edu>
===========================================================
Project Overview is in the following...
This project is a close look at how Linux manages many processes at once. We made a system that takes a huge list of numbers and splits it up into smaller "chunks"[cite: 5, 7]. 
A "family tree" of processes then works together to find the highest number, figure out the average, and look for "hidden keys" (secret negative numbers) that are hidden in the data.

-----------------------------------------------------------
HOW IT WORKS (Key Features)
-----------------------------------------------------------
* Flexible Trees: You can choose how many "children" each process has—either 2, 3, or 5[cite: 19].
* Smart Communication: Parents talk to their children using pipes to send data segments and receive results[cite: 20, 38].
* Fast Response: Instead of waiting in a fixed line, the parent uses poll() to grab results from whichever child finishes their job first[cite: 35, 43].
* Error Handling: The system uses waitpid() and exit codes to make sure every process finishes correctly[cite: 23, 51].
* Activity Logs: Every process records its ID, how long it took, and how much data it sent in a 'trace.csv' file[cite: 76, 86].

-----------------------------------------------------------
GETTING STARTED
-----------------------------------------------------------
1. COMPILING
   Open your Linux terminal and run:
   g++ -Wall -O2 Project1.cpp -o Project1

2. RUNNING THE PROGRAM
   Use the following format:
   ./Project1 <L> <H> <PN> [branch]

   * L: Total numbers in the file (Min: 12,000)[cite: 5].
   * H: Number of hidden keys you want to find[cite: 11].
   * PN: Maximum number of processes (Max: 50)[cite: 13].
   * branch: (Optional) How many children per parent (2, 3, or 5)[cite: 19].

   Example: ./Project1 20000 10 10 3

-----------------------------------------------------------
WHAT TO EXPECT (The Workflow)
-----------------------------------------------------------
* Start: The program generates your random data file if it doesn't exist yet[cite: 5].
* Mapping: The "Root" process maps out the tree and assigns work segments[cite: 22].
* Processing: Children crunch the numbers and find the hidden keys in their specific segment[cite: 40].
* Reporting: Results travel back up the tree until the Root shows you the final Max, Average, and Keys found[cite: 26, 65].

-----------------------------------------------------------
FILES
-----------------------------------------------------------
* Project1.cpp: The "brains" of the operation.
* input.txt: Your raw data file[cite: 62].
* output.txt: Your final results[cite: 63].
* trace.csv: A detailed log of how every process performed[cite: 86].

-----------------------------------------------------------
GROUP LOGISTICS
-----------------------------------------------------------
This project was completed by a group of 5 students[cite: 116]. 
Please refer to our formal report for the Table of Contributions 
and design trade-off analysis[cite: 113, 120].
===========================================================
