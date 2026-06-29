import os

def refactor():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    replacements = {
        # Table Names
        '__tablename__ = "State"': '__tablename__ = "GeoState"',
        'ForeignKey("State.StateID")': 'ForeignKey("GeoState.StateID")',
        'class State(': 'class GeoState(',
        'State,': 'GeoState,',
        ' State ': ' GeoState ',
        
        '__tablename__ = "District"': '__tablename__ = "GeoDistrict"',
        'ForeignKey("District.DistrictID")': 'ForeignKey("GeoDistrict.DistrictID")',
        'class District(': 'class GeoDistrict(',
        'District,': 'GeoDistrict,',
        ' District ': ' GeoDistrict ',
        
        '__tablename__ = "Court"': '__tablename__ = "LegalCourt"',
        'ForeignKey("Court.CourtID")': 'ForeignKey("LegalCourt.CourtID")',
        'class Court(': 'class LegalCourt(',
        'Court,': 'LegalCourt,',
        ' Court ': ' LegalCourt ',
        
        '__tablename__ = "Unit"': '__tablename__ = "PoliceUnit"',
        'ForeignKey("Unit.UnitID")': 'ForeignKey("PoliceUnit.UnitID")',
        'class Unit(': 'class PoliceUnit(',
        'Unit,': 'PoliceUnit,',
        ' Unit ': ' PoliceUnit ',
        
        '__tablename__ = "UnitType"': '__tablename__ = "PoliceUnitType"',
        'ForeignKey("UnitType.UnitTypeID")': 'ForeignKey("PoliceUnitType.UnitTypeID")',
        'class UnitType(': 'class PoliceUnitType(',
        'UnitType,': 'PoliceUnitType,',
        
        '__tablename__ = "Rank"': '__tablename__ = "PoliceRank"',
        'ForeignKey("Rank.RankID")': 'ForeignKey("PoliceRank.RankID")',
        'class Rank(': 'class PoliceRank(',
        'Rank,': 'PoliceRank,',
        
        '__tablename__ = "Designation"': '__tablename__ = "PoliceDesignation"',
        'ForeignKey("Designation.DesignationID")': 'ForeignKey("PoliceDesignation.DesignationID")',
        'class Designation(': 'class PoliceDesignation(',
        'Designation,': 'PoliceDesignation,',
        
        '__tablename__ = "Employee"': '__tablename__ = "PoliceEmployee"',
        'ForeignKey("Employee.EmployeeID")': 'ForeignKey("PoliceEmployee.EmployeeID")',
        'class Employee(': 'class PoliceEmployee(',
        'Employee,': 'PoliceEmployee,',
        
        '__tablename__ = "Section"': '__tablename__ = "LegalSection"',
        'ForeignKey("Section.SectionCode")': 'ForeignKey("LegalSection.LegalSectionCode")',
        'class Section(': 'class LegalSection(',
        'Section,': 'LegalSection,',
        
        '__tablename__ = "ActSectionAssociation"': '__tablename__ = "ActLegalSectionAssociation"',
        'class ActSectionAssociation(': 'class ActLegalSectionAssociation(',
        'ActSectionAssociation,': 'ActLegalSectionAssociation,',
        
        '__tablename__ = "CrimeHeadActSection"': '__tablename__ = "CrimeHeadLegalSection"',
        'class CrimeHeadActSection(': 'class CrimeHeadLegalSection(',
        'CrimeHeadActSection,': 'CrimeHeadLegalSection,',
        
        # Column Names
        'Active = Column(Boolean)': 'IsActive = Column(Boolean)',
        'Hierarchy = Column(Integer)': 'HierarchyLevel = Column(Integer)',
        'SectionCode = Column(': 'LegalSectionCode = Column(',
        'SectionDescription = Column(String)': 'LegalSectionDescription = Column(String)',
        'a.SectionCode': 'a.LegalSectionCode',
        'SectionCode=': 'LegalSectionCode='
    }

    files_to_refactor = [
        os.path.join(base_dir, 'database', 'sqlite.py'),
        os.path.join(base_dir, 'routers', 'api.py'),
        os.path.join(base_dir, 'app.py'),
        os.path.join(base_dir, 'scripts', 'seed_db.py'),
        os.path.join(base_dir, 'scripts', 'seed_datastore_full.py')
    ]

    for filepath in files_to_refactor:
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r') as f:
            content = f.read()
            
        for old_str, new_str in replacements.items():
            content = content.replace(old_str, new_str)
            
        with open(filepath, 'w') as f:
            f.write(content)
            
    print("Refactoring complete.")

if __name__ == "__main__":
    refactor()
