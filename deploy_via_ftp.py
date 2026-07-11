#!/usr/bin/env python3
import os
import sys
from ftplib import FTP

def get_env_credentials():
    env_path = '/Users/yuta/Desktop/work/AI/Antigravity/.agents/.env.txt'
    creds = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line:
                    key, val = line.strip().split('=', 1)
                    creds[key] = val
    return creds

def ensure_remote_dir(ftp, dir_path):
    # Create remote directory hierarchy if it doesn't exist
    parts = [p for p in dir_path.split('/') if p]
    current = ""
    for part in parts:
        current += "/" + part
        try:
            ftp.cwd(current)
        except Exception:
            print(f"Creating remote directory: {current}")
            try:
                ftp.mkd(current)
            except Exception as e:
                print(f"Warning: Failed to create directory {current}: {e}")

def upload_recursive(ftp, local_dir, remote_dir):
    for root, dirs, files in os.walk(local_dir):
        # Filter directories to exclude
        dirs[:] = [d for d in dirs if d not in ('.git', '.github')]
        
        # Convert local absolute path to remote absolute path
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == '.':
            target_remote_dir = remote_dir
        else:
            target_remote_dir = f"{remote_dir}/{rel_path.replace(os.sep, '/')}"
            
        ensure_remote_dir(ftp, target_remote_dir)
        
        for file in files:
            # Exclude deployment script, local blog outline text files, and system files
            if file in ('deploy_via_ftp.py', 'blog_outline_5_episodes.txt', 'blog_outline_10_episodes.txt', '.DS_Store'):
                continue
                
            local_file = os.path.join(root, file)
            remote_file = f"{target_remote_dir}/{file}"
            
            print(f"Uploading: {local_file} -> {remote_file}")
            with open(local_file, 'rb') as f:
                try:
                    ftp.storbinary(f'STOR {remote_file}', f)
                except Exception as e:
                    print(f"Error uploading {file}: {e}")
                    raise e

def main():
    creds = get_env_credentials()
    host = creds.get('DAIFUK_FTP_HOST') or creds.get('FTP_HOST')
    user = creds.get('DAIFUK_FTP_USER') or creds.get('FTP_USER')
    pwd = creds.get('DAIFUK_FTP_PASS') or creds.get('FTP_PASS')
    
    if not all([host, user, pwd]):
        print("Error: FTP credentials missing in .env.txt")
        sys.exit(1)
        
    local_dir = os.path.dirname(os.path.abspath(__file__))
    remote_dir = '/public_html/daifuk.jp'
    
    try:
        ftp = FTP(host)
        print(f"Connecting to FTP host: {host}...")
        ftp.login(user, pwd)
        print("Connected successfully!")
        
        # Start recursive upload
        upload_recursive(ftp, local_dir, remote_dir)
        
        ftp.quit()
        print("\n🎉 SUCCESS: daifuk.jp files deployed successfully over FTP!")
        
    except Exception as e:
        print("FTP deployment failed:", e)
        sys.exit(1)

if __name__ == "__main__":
    main()
