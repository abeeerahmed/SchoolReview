import urllib.request, gzip, os, shutil

url = 'https://github.com/abeeerahmed/SchoolReview/releases/download/v1.0/bd_education.db.gz'
print('Downloading compressed database...')
urllib.request.urlretrieve(url, '/tmp/bd_education.db.gz')
print('Downloaded. Decompressing...')
with gzip.open('/tmp/bd_education.db.gz', 'rb') as f_in:
    with open('/app/schoolreview.db', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
os.remove('/tmp/bd_education.db.gz')
print('Database ready:', os.path.getsize('/app/schoolreview.db') / 1024 / 1024, 'MB')