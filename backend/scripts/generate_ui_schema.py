import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import Base, engine

def generate():
    sql_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "catalyst_ui_schema.md")
    
    # Sensitive fields for PII/ePHI mapping
    pii_fields = [
        'ComplainantName', 'VictimName', 'AccusedName', 'FirstName', 'KGID', 
        'PersonID', 'BriefFacts', 'latitude', 'longitude', 'EmployeeDOB', 'VictimPolice'
    ]
    
    with open(sql_path, "w") as f:
        f.write("# Catalyst Console Schema Blueprint\n\n")
        f.write("Use this exact blueprint to configure the columns, datatypes, and constraints for your 27 tables in the Zoho Catalyst Data Store UI.\n\n")
        
        for table in Base.metadata.sorted_tables:
            f.write(f"### Table: **{table.name}**\n")
            f.write("| Column Id | Column Name | Data Type | Default value | Search Indexed | Is Unique | Is Mandatory | PII/ePHI |\n")
            f.write("| --- | --- | --- | --- | --- | --- | --- | --- |\n")
            
            for idx, col in enumerate(table.columns, 1):
                col_name = col.name
                
                # Map SQLAlchemy types to Zoho Catalyst Data Store UI types
                col_type = str(col.type).upper()
                if "INT" in col_type:
                    ctype = "bigint"
                elif "VARCHAR" in col_type or "STRING" in col_type or "TEXT" in col_type or "CHAR" in col_type:
                    ctype = "varchar(255)" if "TEXT" not in col_type else "varchar(2000)"
                elif "BOOL" in col_type:
                    ctype = "boolean"
                elif "FLOAT" in col_type or "NUMERIC" in col_type:
                    ctype = "double"
                elif "DATE" in col_type or "DATETIME" in col_type:
                    ctype = "datetime"
                else:
                    ctype = "varchar(255)"
                    
                # Constraints
                is_mandatory = "Yes" if not col.nullable or col.primary_key else "No"
                is_unique = "Yes" if col.primary_key or col.unique else "No"
                is_pii = "Yes" if col_name in pii_fields else "No"
                
                # Search Indexed (Index Primary Keys, Foreign Keys, and categorical names)
                is_indexed = "Yes" if (col.primary_key or col.foreign_keys or "Name" in col_name or "No" in col_name) else "No"
                if "BriefFacts" in col_name: is_indexed = "No" # Max length too long for search indexing
                
                default_val = "None"
                
                f.write(f"| {idx} | {col_name} | {ctype} | {default_val} | {is_indexed} | {is_unique} | {is_mandatory} | {is_pii} |\n")
            f.write("\n")
            
    print(f"Generated at {sql_path}")

if __name__ == "__main__":
    generate()
