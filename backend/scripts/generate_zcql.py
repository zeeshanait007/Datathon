import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import Base, engine
from sqlalchemy.schema import CreateTable

def generate():
    sql_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "zcql_schema.txt")
    with open(sql_path, "w") as f:
        f.write("-- ========================================================================\n")
        f.write("-- ZCQL (Zoho Catalyst Query Language) DDL Reference\n")
        f.write("-- ========================================================================\n")
        f.write("-- IMPORTANT NOTE: ZCQL strictly does NOT support CREATE TABLE execution \n")
        f.write("-- via the Python SDK, REST API, or the CLI. \n")
        f.write("-- This file maps the 27-table ER schema strictly into Catalyst Data Store \n")
        f.write("-- specific datatypes (e.g. bigint, varchar, double) for your reference \n")
        f.write("-- when configuring the tables manually in the UI.\n")
        f.write("-- ========================================================================\n\n")
        
        for table in Base.metadata.sorted_tables:
            create_stmt = str(CreateTable(table).compile(engine)).strip()
            
            # Map standard SQL datatypes to Zoho Catalyst Data Store datatypes
            create_stmt = create_stmt.replace("INTEGER", "bigint")
            create_stmt = create_stmt.replace("VARCHAR", "varchar(255)")
            create_stmt = create_stmt.replace("BOOLEAN", "boolean")
            create_stmt = create_stmt.replace("FLOAT", "double")
            create_stmt = create_stmt.replace("DATETIME", "datetime")
            create_stmt = create_stmt.replace("DATE", "datetime")
            create_stmt = create_stmt.replace("TEXT", "varchar(2000)")
            create_stmt = create_stmt.replace("NUMERIC", "double")
            
            f.write(create_stmt + ";\n\n")
            
    print(f"Successfully generated pseudo-ZCQL schema at {sql_path}")

if __name__ == "__main__":
    generate()
