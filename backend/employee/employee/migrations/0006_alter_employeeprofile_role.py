# Generated by Django 4.2.21 on 2025-05-16 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0005_employeeprofile_bonus_payment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employeeprofile',
            name='role',
            field=models.CharField(choices=[('ADMIN', 'Administrator'), ('MANAGER', 'Manager'), ('SALESMAN', 'Salesman'), ('CLERK', 'Clerk'), ('DELIVERYMAN', 'Deliveryman'), ('DIRECTOR', 'Director'), ('CEO', 'CEO')], default='DELIVERYMAN', max_length=20),
        ),
    ]
