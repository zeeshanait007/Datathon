import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sqlite import Base, engine
from sqlalchemy.schema import CreateTable

def generate():
    sql_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "database", "catalyst_schema.sql")
    with open(sql_path, "w") as f:
        f.write("-- Zoho Catalyst Data Store ER Schema (27 Tables)\n\n")
        # Base.metadata.sorted_tables ensures tables are created in the correct foreign-key dependency order!
        for table in Base.metadata.sorted_tables:
            create_stmt = str(CreateTable(table).compile(engine)).strip()
            # Clean up the output slightly for readability
            f.write(create_stmt + ";\n\n")
    print(f"Successfully generated schema at {sql_path}")

if __name__ == "__main__":
    generate()
