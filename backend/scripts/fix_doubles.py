import os

def fix_doubles():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    replacements = {
        'GeoGeo': 'Geo',
        'PolicePolice': 'Police',
        'LegalLegal': 'Legal',
        'IsIsActive': 'IsActive',
        'HierarchyLevelLevel': 'HierarchyLevel',
        'ActLegalLegalSectionAssociation': 'ActLegalSectionAssociation',
        'CrimeHeadLegalLegalSection': 'CrimeHeadLegalSection'
    }

    files_to_fix = [
        os.path.join(base_dir, 'database', 'sqlite.py'),
        os.path.join(base_dir, 'routers', 'api.py'),
        os.path.join(base_dir, 'app.py'),
        os.path.join(base_dir, 'scripts', 'seed_db.py'),
        os.path.join(base_dir, 'scripts', 'seed_datastore_full.py')
    ]

    for filepath in files_to_fix:
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r') as f:
            content = f.read()
            
        for old_str, new_str in replacements.items():
            content = content.replace(old_str, new_str)
            
        with open(filepath, 'w') as f:
            f.write(content)
            
    print("Fixed double prefixes.")

if __name__ == "__main__":
    fix_doubles()
