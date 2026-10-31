import {test,expect} from '@playwright/test';
test('mission lifecycle on a phone viewport and safe text rendering',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');await page.getByLabel('Client fictif').fill('Client synthétique');await page.getByLabel('Intitulé').fill('Automatiser le reporting');
 await page.getByRole('button',{name:'Créer la mission'}).click();
 await page.getByRole('button',{name:'Démarrer',exact:true}).click();await page.getByRole('button',{name:'Terminer',exact:true}).click();
 await expect(page.getByText('Terminée',{exact:true})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByLabel('Client fictif').fill('<img src=x onerror=alert(1)>');await page.getByLabel('Intitulé').fill('Texte littéral');await page.getByRole('button',{name:'Créer la mission'}).click();
 await expect(page.getByText('<img src=x onerror=alert(1)>',{exact:true})).toBeVisible();await expect(page.locator('article img')).toHaveCount(0);expect(errors).toEqual([]);
});
