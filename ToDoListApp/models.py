from django.db import models

# Item model.

'''
Item model has the following attributes:
===========

item_id: pk, auto increment
title: varchar(50)
description: varchar(500)
start_date: date, the start date of an item
comp_date: date, the estimated end date of an item
status: either C (for completed) or NC (for not completed)
'''


class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    title = models.CharField('Title', max_length=50)
    description = models.CharField('Description', max_length=500)
    start_date = models.DateField('Start Date')
    comp_date = models.DateField('Completion Date')
    STATUS_CHOICES = (
        ('NC', 'Not completed'),
        ('C', 'Completed')
    )
    status = models.CharField(choices=STATUS_CHOICES, default='NC', max_length=20)
