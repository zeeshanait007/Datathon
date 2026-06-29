import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import Base, engine
from sqlalchemy.schema import CreateTable

def generate():
    sql_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "zcql_schema_safe.txt")
    with open(sql_path, "w") as f:
        f.write("-- ========================================================================\n")
        f.write("-- ZCQL-SAFE DDL Reference (No Reserved Keywords)\n")
        f.write("-- ========================================================================\n")
        f.write("-- This file replaces highly conflicting ZCQL reserved words (like 'Rank',\n")
        f.write("-- 'Unit', 'State', and 'Active') with safe alternatives (like 'PoliceRank',\n")
        f.write("-- 'PoliceUnit', 'GeoState', and 'IsActive') to prevent SDK crashes.\n")
        f.write("-- ========================================================================\n\n")
        
        for table in Base.metadata.sorted_tables:
            create_stmt = str(CreateTable(table).compile(engine)).strip()
            
            # 1. Map standard SQL datatypes to Zoho Catalyst
            create_stmt = create_stmt.replace("INTEGER", "bigint")
            create_stmt = create_stmt.replace("VARCHAR", "varchar(255)")
            create_stmt = create_stmt.replace("BOOLEAN", "boolean")
            create_stmt = create_stmt.replace("FLOAT", "double")
            create_stmt = create_stmt.replace("DATETIME", "datetime")
            create_stmt = create_stmt.replace("DATE", "datetime")
            create_stmt = create_stmt.replace("TEXT", "varchar(2000)")
            create_stmt = create_stmt.replace("NUMERIC", "double")
            
            # 2. Map Reserved Keyword Table Names -> Safe Table Names
            create_stmt = create_stmt.replace('TABLE "State"', 'TABLE "GeoState"')
            create_stmt = create_stmt.replace('REFERENCES "State"', 'REFERENCES "GeoState"')
            create_stmt = create_stmt.replace('TABLE "District"', 'TABLE "GeoDistrict"')
            create_stmt = create_stmt.replace('REFERENCES "District"', 'REFERENCES "GeoDistrict"')
            create_stmt = create_stmt.replace('TABLE "Court"', 'TABLE "LegalCourt"')
            create_stmt = create_stmt.replace('REFERENCES "Court"', 'REFERENCES "LegalCourt"')
            create_stmt = create_stmt.replace('TABLE "Unit"', 'TABLE "PoliceUnit"')
            create_stmt = create_stmt.replace('REFERENCES "Unit"', 'REFERENCES "PoliceUnit"')
            create_stmt = create_stmt.replace('TABLE "UnitType"', 'TABLE "PoliceUnitType"')
            create_stmt = create_stmt.replace('REFERENCES "UnitType"', 'REFERENCES "PoliceUnitType"')
            create_stmt = create_stmt.replace('TABLE "Rank"', 'TABLE "PoliceRank"')
            create_stmt = create_stmt.replace('REFERENCES "Rank"', 'REFERENCES "PoliceRank"')
            create_stmt = create_stmt.replace('TABLE "Designation"', 'TABLE "PoliceDesignation"')
            create_stmt = create_stmt.replace('REFERENCES "Designation"', 'REFERENCES "PoliceDesignation"')
            create_stmt = create_stmt.replace('TABLE "Employee"', 'TABLE "PoliceEmployee"')
            create_stmt = create_stmt.replace('REFERENCES "Employee"', 'REFERENCES "PoliceEmployee"')
            create_stmt = create_stmt.replace('TABLE "Section"', 'TABLE "LegalSection"')
            create_stmt = create_stmt.replace('REFERENCES "Section"', 'REFERENCES "LegalSection"')
            create_stmt = create_stmt.replace('TABLE "ActSectionAssociation"', 'TABLE "ActLegalSectionAssociation"')
            create_stmt = create_stmt.replace('TABLE "CrimeHeadActSection"', 'TABLE "CrimeHeadLegalSection"')
            
            # 3. Map Reserved Keyword Column Names -> Safe Column Names
            create_stmt = create_stmt.replace('"Active"', '"IsActive"')
            create_stmt = create_stmt.replace('"Hierarchy"', '"HierarchyLevel"')
            create_stmt = create_stmt.replace('"SectionCode"', '"LegalSectionCode"')
            create_stmt = create_stmt.replace('("SectionCode")', '("LegalSectionCode")')
            create_stmt = create_stmt.replace('"SectionDescription"', '"LegalSectionDescription"')
            
            f.write(create_stmt + ";\n\n")
            
    print(f"Successfully generated ZCQL safe schema at {sql_path}")

if __name__ == "__main__":
    generate()
