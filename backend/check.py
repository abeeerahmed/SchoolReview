import sqlite3
c = sqlite3.connect('schoolreview.db')
print('Total institutes:', c.execute('SELECT COUNT(*) FROM all_institutes_clean').fetchone()[0])
print('Mobile count:', c.execute("SELECT COUNT(*) FROM all_institutes_clean WHERE mobile IS NOT NULL AND mobile != ''").fetchone()[0])
c.close()