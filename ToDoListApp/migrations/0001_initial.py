# Generated by Django 2.1.2 on 2018-10-14 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('item_id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=50, verbose_name='Title')),
                ('description', models.CharField(max_length=500, verbose_name='Description')),
                ('start_date', models.DateField(verbose_name='Start Date')),
                ('comp_date', models.DateField(verbose_name='Completion Date')),
                ('status', models.CharField(choices=[('NC', 'Not completed'), ('C', 'Completed')], default='Not completed', max_length=20)),
            ],
        ),
    ]
