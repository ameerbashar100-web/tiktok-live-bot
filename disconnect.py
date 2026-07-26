import os
import subprocess

def check_and_disconnect():
    print("Checking Bluetooth status...")
    result = subprocess.run(["cmd", "bluetooth_manager", "disable"], capture_output=True, text=True)
    if result.returncode == 0:
        print("Bluetooth disabled successfully.")
    else:
        print("Failed. Check Termux root permissions.")

if __name__ == "__main__":
    check_and_disconnect()
  
