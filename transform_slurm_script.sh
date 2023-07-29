#!/bin/bash
#SBATCH --job-name=CSV2CDF
#SBATCH --output=cdf2fhir.out
#SBATCH --error=cdf2fhir.err
#SBATCH --time=03:59:00
#SBATCH --cpus-per-task=1
#SBATCH --mem=2gb
#SBATCH --nodes=1
#SBATCH --open-mode=append
#SBATCH --export=NONE
#SBATCH --get-user-env=L60


module load nodejs/16.15.1-GCCcore-11.3.0
module list

node_modules/typescript/bin/tsc --build --clean
node_modules/typescript/bin/tsc
#npm run transform --  ../data_samples_tiny/ -o /home/umcg-hcadavid/temporal-data/pheno_lifelines_fhir
npm run transform -- /home/umcg-hcadavid/temporal-data/pheno_lifelines_csd_out -o /home/umcg-hcadavid/temporal-data/pheno_lifelines_fhir
